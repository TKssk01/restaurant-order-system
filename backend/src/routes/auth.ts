// 必要なモジュールのインポート
// Express関連の型とルーター機能
import { Router, Request, Response, NextFunction } from 'express';
// TypeORMのリポジトリ取得用関数
import { getRepository } from 'typeorm';
// User エンティティの型定義
import { User } from '../entity/User';
// パスワードハッシュ化ライブラリ
import bcrypt from 'bcrypt';
// JWT生成ライブラリ
import jwt from 'jsonwebtoken';
// Express のリクエストハンドラー型定義
import { RequestHandler } from 'express-serve-static-core';

// Express ルーターのインスタンスを作成
const router = Router();

// ユーザー登録用のエンドポイント（POST /register）
router.post('/register', async (req: Request, res: Response) => {
  // Userエンティティのリポジトリを取得
  const userRepository = getRepository(User);
  // リクエストボディからユーザー情報を取得
  const { username, password, role } = req.body;

  // パスワードをハッシュ化（ソルトラウンド: 10）
  const hashedPassword = await bcrypt.hash(password, 10);
  // ユーザーエンティティを作成
  const user = userRepository.create({ username, password: hashedPassword, role });

  try {
    // ユーザーをデータベースに保存
    const result = await userRepository.save(user);
    // 作成成功時は201(Created)とユーザー情報を返す
    res.status(201).json(result);
  } catch (error) {
    // エラー発生時は400(Bad Request)とエラーメッセージを返す
    res.status(400).json({ message: 'ユーザー登録に失敗しました。' });
  }
});

// ログインハンドラーの定義
const loginHandler: RequestHandler = async (req, res, next) => {
  // Userエンティティのリポジトリを取得
  const userRepository = getRepository(User);
  // リクエストボディからログイン情報を取得
  const { username, password } = req.body;

  try {
    // ユーザー名で該当ユーザーを検索
    const user = await userRepository.findOne({ where: { username } });
    // ユーザーが存在しない場合のエラーハンドリング
    if (!user) {
      res.status(400).json({ message: 'ユーザーが見つかりません。' });
      return;
    }

    // パスワードの照合
    const isValidPassword = await bcrypt.compare(password, user.password);
    // パスワードが一致しない場合のエラーハンドリング
    if (!isValidPassword) {
      res.status(400).json({ message: 'パスワードが正しくありません。' });
      return;
    }

    // JWTトークンの生成
    // ペイロードにユーザーID、ユーザー名、役割を含める
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      // JWT秘密鍵（環境変数から取得、なければデフォルト値を使用）
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' } // トークンの有効期限を1時間に設定
    );

    // トークンをレスポンスとして返す
    res.json({ token });
  } catch (error) {
    // エラーを次のミドルウェアに渡す
    next(error);
  }
};

// ルーターをエクスポート
export default router;