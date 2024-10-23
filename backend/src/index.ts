// TypeORMが必要とするメタデータのサポッドを有効化
import 'reflect-metadata';
// Expressフレームワークと型をインポート
import express, { Request, Response } from 'express';
// TypeORMのデータベース接続を作成する関数をインポート
import { createConnection } from 'typeorm';
// 認証関連のルートをインポート
import authRoutes from './routes/auth';
// JWT認証ミドルウェアをインポート
import { authenticateJWT } from './middleware/auth';
// MenuItemエンティティをインポート
import { MenuItem } from './entity/MenuItem';
// Userエンティティをインポート
import { User } from './entity/User';
// Expressアプリケーションのインスタンスを作成
const app = express();
// ポート番号を環境変数から取得、なければ3000を使用
const PORT = process.env.PORT || 3000;
// JSON形式のリクエストボディをパースするミドルウェアを設定
app.use(express.json());
// ルート設定
// ルートパスにアクセスした際のレスポンス
app.get('/', (req: Request, res: Response) => {
  res.send('レストラン注文システムのバックエンドへようこそ！');
});
// 認証ルートの適用
// /authパス以下のルートに認証ルートを適用
app.use('/auth', authRoutes);
// 保護されたルートの例
// JWT認証を通過したユーザーに対するレスポンス
app.get('/protected', authenticateJWT, (req: Request, res: Response) => {
  res.send('保護されたルートにアクセスしました。');
});
// データベース接続とサーバー起動
createConnection().then(async connection => {
  // メニュー関連のルート
  // MenuItemエンティティのリポジトリを取得
  const menuItemRepository = connection.getRepository(MenuItem);
  // メニュー一覧を取得するエンドポイント
  app.get('/menu', async (req: Request, res: Response) => {
    // すべてのメニュー項目をデータベースから取得
    const menu = await menuItemRepository.find();
    // メニュー一覧をJSON形式でレスポンス
    res.json(menu);
  });
  // 新しいメニュー項目を追加するエンドポイント
  app.post('/menu', authenticateJWT, async (req: Request, res: Response) => {
    // リクエストボディから新しいMenuItemを作成
    const newItem = menuItemRepository.create(req.body);
    // 新しいMenuItemをデータベースに保存
    const result = await menuItemRepository.save(newItem);
    // 保存したMenuItemをJSON形式でレスポンスし、ステータスコード201を返す
    res.status(201).json(result);
  });

  // 他のエンドポイントもここに追加
  // 例: メニュー項目の更新、削除など

  // サーバーを指定したポートで起動
  app.listen(PORT, () => {
    // サーバー起動時にコンソールにメッセージを表示
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(error => 
  // データベース接続に失敗した場合、エラーをコンソールに表示
  console.log(error)
);
