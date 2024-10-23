// TypeORMから必要なデコレーターをインポート
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

/*
以下のようなSQL文と同等のテーブルを作成します：

CREATE TABLE menu_item (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    price DECIMAL NOT NULL,
    description VARCHAR(255)
);
*/


// このクラスがデータベースのテーブルであることを示す
@Entity()
export class MenuItem {
  // プライマリーキーとして自動採番されるID列を定義
  // !はTypeScriptの非Nullアサーション演算子で、この値が必ず初期化されることを示す
  @PrimaryGeneratedColumn()
  id!: number;

  // 通常の文字列カラムを定義
  // !はTypeScriptの非Nullアサーション演算子
  @Column()
  name!: string;

  // 小数点をサポートする数値型カラムを定義
  // decimal型は金額など正確な数値計算が必要な場合に使用
  @Column('decimal')
  price!: number;

  // NULL値を許容する文字列カラムを定義
  // nullable: true で、このフィールドは省略可能
  @Column({ nullable: true })
  description!: string;
}