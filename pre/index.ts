// readlineモジュールをインポート
import * as readline from 'readline';

// メニューアイテムの構造を定義するインターフェース
interface MenuItem {
  name: string;    // メニューアイテムの名前
  price: number;   // メニューアイテムの価格
  stock: number;   // メニューアイテムの在庫数
}

// 注文の構造を定義するインターフェース
interface Order {
  name: string;     // 注文するアイテムの名前
  quantity: number; // 注文する数量
}

// メニューの初期設定
const menu: MenuItem[] = [
  { name: "Pasta", price: 12.5, stock: 10 },  // パスタのメニューアイテム
  { name: "Pizza", price: 15.0, stock: 5 },   // ピザのメニューアイテム
  { name: "Salad", price: 7.0, stock: 20 },   // サラダのメニューアイテム
];

// readlineインターフェースの作成
const rl = readline.createInterface({
  input: process.stdin,   // 標準入力を入力ソースに設定
  output: process.stdout, // 標準出力を出力先に設定
});

// 注文を入力する関数
function inputOrders(): Promise<Order[]> {
  const orders: Order[] = []; // 注文を格納する配列を初期化

  // 注文を尋ねる再帰関数
  function askForOrder(): Promise<Order[]> {
    return new Promise((resolve) => {
      rl.question('注文を追加しますか？(yes/no): ', (answer) => { // ユーザーに注文の追加を尋ねる
        if (answer.toLowerCase() === 'yes') { // 回答が 'yes' の場合
          rl.question('アイテム名: ', (name) => { // アイテム名を入力させる
            // メニューに存在するアイテムか確認
            const menuItem = menu.find((item) => item.name.toLowerCase() === name.toLowerCase());
            if (!menuItem) { // アイテムがメニューに存在しない場合
              console.log(`メニューに存在しないアイテムです: ${name}`); // エラーメッセージを表示
              askForOrder().then(resolve); // 再度注文を尋ねる
              return;
            }
            rl.question('数量: ', (quantityStr) => { // 数量を入力させる
              const quantity = parseInt(quantityStr, 10); // 入力された数量を整数に変換
              if (isNaN(quantity) || quantity <= 0) { // 数量が有効な正の整数か確認
                console.log('数量は正の整数で入力してください。'); // エラーメッセージを表示
                askForOrder().then(resolve); // 再度注文を尋ねる
                return;
              }
              orders.push({ name: menuItem.name, quantity }); // 注文を配列に追加
              askForOrder().then(resolve); // 再度注文を尋ねる
            });
          });
        } else { // 回答が 'no' の場合
          resolve(orders); // 注文配列を返す
        }
      });
    });
  }

  return askForOrder(); // 最初の注文を尋ねる
}

// 注文を処理する関数
function processOrders(menuItems: MenuItem[], ordersList: Order[]): void {
  let totalCost = 0; // 合計金額を初期化

  for (const order of ordersList) { // 各注文を処理
    const menuItem = menuItems.find((item) => item.name === order.name); // 注文されたアイテムをメニューから検索

    if (menuItem && menuItem.stock >= order.quantity) { // アイテムが存在し、在庫が十分な場合
      menuItem.stock -= order.quantity; // 在庫を減らす
      totalCost += menuItem.price * order.quantity; // 合計金額に価格×数量を加算
    } else { // アイテムが存在しない、または在庫が不足している場合
      console.log(`在庫不足: ${order.name}`); // 在庫不足のメッセージを表示
      rl.close(); // readlineインターフェースを閉じる
      return; // 関数を終了
    }
  }

  // 消費税計算
  const tax = totalCost * 0.1; // 合計金額の10%を税として計算
  totalCost += tax; // 税を合計金額に加算

  console.log(`注文成功。消費税含む合計金額: ¥${totalCost.toFixed(2)}`); // 成功メッセージと合計金額を表示
  rl.close(); // readlineインターフェースを閉じる
}

// メイン関数
async function main() {
  console.log('--- メニュー ---'); // メニューのタイトルを表示
  for (const item of menu) { // メニューの各アイテムを表示
    console.log(`- ${item.name}: ¥${item.price}（在庫: ${item.stock}）`);
  }

  console.log('\n--- 注文の入力 ---'); // 注文入力のセクションを表示
  const orders = await inputOrders(); // ユーザーからの注文を待機

  console.log('\n--- 注文処理 ---'); // 注文処理のセクションを表示
  processOrders(menu, orders); // 注文を処理
}

// メイン関数を実行
main();
