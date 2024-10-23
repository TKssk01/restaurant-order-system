// Expressの型定義をインポート
// Request: HTTPリクエストの型
// Response: HTTPレスポンスの型
// NextFunction: 次のミドルウェアを呼び出す関数の型
import { Request, Response, NextFunction } from 'express';
// JWT(JSON Web Token)を扱うためのライブラリをインポート
import jwt from 'jsonwebtoken';

// Requestインターフェースを拡張して、user属性を追加
// このカスタム型により、req.userにユーザー情報を格納できるようになる
interface AuthRequest extends Request {
  user?: any;  // any型は望ましくないので、実際は具体的な型を定義すべき
}

// JWTトークンを検証するミドルウェア関数を定義
// req: リクエスト情報
// res: レスポンス情報
// next: 次のミドルウェアを呼び出す関数
export const authenticateJWT = (req: AuthRequest, res: Response, next: NextFunction) => {
  // リクエストヘッダーからAuthorizationヘッダーを取得
  const authHeader = req.headers.authorization;

  // Authorizationヘッダーが存在する場合の処理
  if (authHeader) {
    // "Bearer <token>"の形式からトークン部分を抽出
    const token = authHeader.split(' ')[1];

    // JWTトークンを検証
    // 'your_jwt_secret'は秘密鍵（本番環境では環境変数として管理すべき）
    jwt.verify(token, 'your_jwt_secret', (err, user) => {
      // トークンが無効な場合は403(Forbidden)を返す
      if (err) {
        return res.sendStatus(403);
      }

      // トークンが有効な場合、デコードされたユーザー情報をリクエストに追加
      req.user = user;
      // 次のミドルウェアに処理を渡す
      next();
    });
  } else {
    // Authorizationヘッダーがない場合は401(Unauthorized)を返す
    res.sendStatus(401);
  }
};