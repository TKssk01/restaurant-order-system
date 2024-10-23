// TypeORMのデコレーターをインポート：
// - Entity: テーブル定義用
// - PrimaryGeneratedColumn: 主キー用
// - Column: 通常のカラム用
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
// @Entity()デコレーターで、このクラスがデータベースのテーブルとなることを宣言
@Entity()
export class User {
  // 自動採番される主キー（ID）を定義
  // !は非Nullアサーション演算子で、TypeORMが確実に値を設定することを示す
  @PrimaryGeneratedColumn()
  id!: number;
  // ユニーク制約付きのユーザー名カラムを定義
  // unique: true で同じusernameは登録できない
  @Column({ unique: true })
  username!: string;
  // パスワード用のカラムを定義
  // 注: 実際のアプリケーションではパスワードはハッシュ化して保存すべき
  @Column()
  password!: string;
  // ユーザーの役割を示すカラムを定義
  // コメントにある通り 'customer' または 'staff' が入る
  @Column()
  role!: string; // 'customer' または 'staff'
}