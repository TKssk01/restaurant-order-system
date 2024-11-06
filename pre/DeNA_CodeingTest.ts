// メイン関数: 入力された行データに基づいて適切なステップを処理します。
function main(lines: string[]) {
    let currentLineIndex = 0;
  
    // ステップ番号を解析して検証
    const stepNumber = parseInt(lines[currentLineIndex++].trim(), 10);
    if (isNaN(stepNumber) || stepNumber < 1 || stepNumber > 4) {
      console.error('1、2、3、または4を指定してください。');
      return;
    }
  
    // ステップに応じた処理を実行
    switch (stepNumber) {
      case 1:
        handleStep1(lines, currentLineIndex);
        break;
      case 2:
        handleStep2(lines, currentLineIndex);
        break;
      case 3:
        handleStep3(lines, currentLineIndex);
        break;
      case 4:
        handleStep4(lines, currentLineIndex);
        break;
      default:
        console.error('サポートされていない番号です。');
    }
  }
  
  //ステップ1の処理: メニュー情報の読み込みと注文の処理を行います。
  function handleStep1(lines: string[], startLine: number): void {
    let currentLineIndex = startLine;
  
    // メニュー項目の数を解析
    const numberOfMenuItems = parseInt(lines[currentLineIndex++].trim(), 10);
    if (isNaN(numberOfMenuItems) || numberOfMenuItems < 1 || numberOfMenuItems > 10000) {
      console.error('1から10000の範囲で指定してください。');
      return;
    }
  
    // メニュー情報を格納するマップを初期化
    const menuItems: Map<number, { stock: number; price: number }> = new Map();
  
    // メニュー情報を読み込む
    for (let i = 0; i < numberOfMenuItems; i++) {
      if (currentLineIndex >= lines.length) {
        console.error('メニュー情報の行数が不足');
        return;
      }
  
      const [dishStr, stockStr, priceStr] = lines[currentLineIndex++].trim().split(' ');
      const dishNumber = parseInt(dishStr, 10);
      const stockQuantity = parseInt(stockStr, 10);
      const dishPrice = parseInt(priceStr, 10);
  
      // 入力値の検証
      if (isNaN(dishNumber) || isNaN(stockQuantity) || isNaN(dishPrice)) {
        console.error('メニュー情報のフォーマットが無効');
        return;
      }
  
      if (
        dishNumber < 1 || dishNumber > 999999 ||
        stockQuantity < 1 || stockQuantity > 10000 ||
        dishPrice < 1 || dishPrice > 100000
      ) {
        console.error('メニュー情報の値が範囲外です。');
        return;
      }
  
      if (menuItems.has(dishNumber)) {
        console.error(`重複する料理番号が検出: ${dishNumber}`);
        return;
      }
  
      // メニュー情報をマップに追加
      menuItems.set(dishNumber, { stock: stockQuantity, price: dishPrice });
    }
  
    // 残りの行は注文情報
    const orderLines = lines.slice(currentLineIndex);
  
    // 各注文を処理
    for (const orderLine of orderLines) {
      const parts = orderLine.trim().split(' ');
  
      // 注文フォーマットの検証
      if (parts.length !== 4 || parts[0] !== 'order') {
        console.error(`注文フォーマットエラー: ${orderLine}`);
        continue; // フォーマットが正しくない場合はスキップ
      }
  
      const tableNumber = parseInt(parts[1], 10);
      const dishNumber = parseInt(parts[2], 10);
      const orderQuantity = parseInt(parts[3], 10);
  
      // 注文値の検証
      if (isNaN(tableNumber) || isNaN(dishNumber) || isNaN(orderQuantity)) {
        console.error(`注文値が無効です: ${orderLine}`);
        continue; // 値が数値でない場合はスキップ
      }
  
      if (
        tableNumber < 1 || tableNumber > 10000 ||
        dishNumber < 1 || dishNumber > 999999 ||
        orderQuantity < 1 || orderQuantity > 99
      ) {
        console.error(`注文値が範囲外です: ${orderLine}`);
        continue; // 値が範囲外の場合はスキップ
      }
  
      // 料理番号の存在確認
      if (!menuItems.has(dishNumber)) {
        // 料理が存在しない場合は "sold out" を出力
        console.log(`sold out ${tableNumber}`);
        continue;
      }
  
      const menuItem = menuItems.get(dishNumber)!;
  
      if (menuItem.stock >= orderQuantity) {
        // 在庫が十分にある場合、注文を受理し出力
        for (let i = 0; i < orderQuantity; i++) {
          console.log(`received order ${tableNumber} ${dishNumber}`);
        }
        // 在庫を減少
        menuItem.stock -= orderQuantity;
      } else {
        // 在庫が不足している場合、"sold out" を出力
        console.log(`sold out ${tableNumber}`);
      }
    }
  }
  
  //ステップ2の処理: 電子レンジの管理と注文の調理状況を扱います。
  function handleStep2(lines: string[], startLine: number): void {
    let currentLineIndex = startLine;
  
    // メニュー数Mと電子レンジの数Kを解析
    if (currentLineIndex >= lines.length) {
      console.error('MとKの値が不足');
      return;
    }
    const [menuCountStr, microwaveCountStr] = lines[currentLineIndex++].trim().split(' ');
    const menuCount = parseInt(menuCountStr, 10);
    const microwaveCount = parseInt(microwaveCountStr, 10);
  
    if (
      isNaN(menuCount) || isNaN(microwaveCount) ||
      menuCount < 1 || menuCount > 10000 ||
      microwaveCount < 1 || microwaveCount > 1000
    ) {
      console.error('MまたはKの値が無効です。');
      return;
    }
  
    // メニュー情報を読み込む
    const menuSet: Set<number> = new Set();
  
    for (let i = 0; i < menuCount; i++) {
      if (currentLineIndex >= lines.length) {
        console.error('メニュー情報の行数が不足しています。');
        return;
      }
  
      const [dishStr, priceStr] = lines[currentLineIndex++].trim().split(' ');
      const dishNumber = parseInt(dishStr, 10);
      const dishPrice = parseInt(priceStr, 10);
  
      // 入力値の検証
      if (isNaN(dishNumber) || isNaN(dishPrice)) {
        console.error('メニュー情報のフォーマットが無効です。');
        return;
      }
  
      if (
        dishNumber < 1 || dishNumber > 999999 ||
        dishPrice < 1 || dishPrice > 100000
      ) {
        console.error('メニュー情報の値が範囲外です。');
        return;
      }
  
      if (menuSet.has(dishNumber)) {
        console.error(`重複する料理番号が検出されました: ${dishNumber}`);
        return;
      }
  
      // メニュー番号をセットに追加
      menuSet.add(dishNumber);
    }
  
    // 残りの行は注文受理情報または料理完了情報
    const eventLines = lines.slice(currentLineIndex);
  
    // 電子レンジの状態管理
    let availableMicrowaves = microwaveCount;
    const cookingMap: Map<number, number> = new Map(); // 料理番号ごとに調理中の数を追跡
    const orderQueue: Array<{ tableNumber: number; dishNumber: number }> = []; // 待機中の注文
  
    for (const eventLine of eventLines) {
      const parts = eventLine.trim().split(' ');
  
      if (parts[0] === 'received' && parts[1] === 'order') {
        // 注文受理情報の処理
        if (parts.length !== 4) {
          console.error(`受理された注文のフォーマットが無効です: ${eventLine}`);
          console.log(`wait`);
          continue;
        }
  
        const tableNumber = parseInt(parts[2], 10);
        const dishNumber = parseInt(parts[3], 10);
  
        if (isNaN(tableNumber) || isNaN(dishNumber)) {
          console.error(`受理された注文の値が無効です: ${eventLine}`);
          console.log(`wait`);
          continue;
        }
  
        if (!menuSet.has(dishNumber)) {
          // メニューに存在しない料理番号
          console.log(`sold out ${tableNumber}`);
          continue;
        }
  
        if (availableMicrowaves > 0) {
          // 電子レンジが利用可能な場合、調理を開始
          availableMicrowaves--;
          cookingMap.set(dishNumber, (cookingMap.get(dishNumber) || 0) + 1);
          console.log(`${dishNumber}`);
        } else {
          // 電子レンジが全て使用中の場合、注文を待機キューに追加
          orderQueue.push({ tableNumber, dishNumber });
          console.log(`wait`);
        }
  
      } else if (parts[0] === 'complete') {
        // 調理完了情報の処理
        if (parts.length !== 2) {
          console.error(`調理完了情報のフォーマットが無効です: ${eventLine}`);
          console.log(`unexpected input`);
          continue;
        }
  
        const dishNumber = parseInt(parts[1], 10);
  
        if (isNaN(dishNumber)) {
          console.error(`調理完了情報の値が無効です: ${eventLine}`);
          console.log(`unexpected input`);
          continue;
        }
  
        if (cookingMap.has(dishNumber) && cookingMap.get(dishNumber)! > 0) {
          // 調理中の料理が完了
          cookingMap.set(dishNumber, cookingMap.get(dishNumber)! - 1);
          if (cookingMap.get(dishNumber)! === 0) {
            cookingMap.delete(dishNumber);
          }
          availableMicrowaves++;
  
          if (orderQueue.length > 0) {
            // 待機キューに注文がある場合、次の注文を調理
            const nextOrder = orderQueue.shift()!;
            const nextDishNumber = nextOrder.dishNumber;
  
            cookingMap.set(nextDishNumber, (cookingMap.get(nextDishNumber) || 0) + 1);
            availableMicrowaves--;
            console.log(`ok ${nextDishNumber}`);
          } else {
            // 待機キューに注文がない場合
            console.log(`ok`);
          }
        } else {
          // 調理中でない料理の完了情報が来た場合
          console.log(`unexpected input`);
        }
  
      } else {
        // 不明なコマンドの場合
        console.error(`未知のコマンドが検出されました: ${eventLine}`);
        console.log(`unexpected input`);
      }
    }
  }
  
  //ステップ3の処理: 注文の完了を管理し、準備が整った注文を通知します。
  function handleStep3(lines: string[], startLine: number): void {
    let currentLineIndex = startLine;
  
    // メニュー項目の数を解析
    const numberOfMenuItems = parseInt(lines[currentLineIndex++].trim(), 10);
    if (isNaN(numberOfMenuItems) || numberOfMenuItems < 1 || numberOfMenuItems > 10000) {
      console.error('無効');
      return;
    }
  
    // メニュー情報をセットに追加
    const menuSet: Set<number> = new Set();
  
    for (let i = 0; i < numberOfMenuItems; i++) {
      if (currentLineIndex >= lines.length) {
        console.error('メニュー情報の行数が不足。');
        return;
      }
  
      const [dishStr, priceStr] = lines[currentLineIndex++].trim().split(' ');
      const dishNumber = parseInt(dishStr, 10);
      const dishPrice = parseInt(priceStr, 10);
  
      // 入力値の検証
      if (isNaN(dishNumber) || isNaN(dishPrice)) {
        console.error('メニュー情報のフォーマットが無効です。');
        return;
      }
  
      if (
        dishNumber < 1 || dishNumber > 999999 ||
        dishPrice < 1 || dishPrice > 100000
      ) {
        console.error('メニュー情報の値が範囲外です。');
        return;
      }
  
      if (menuSet.has(dishNumber)) {
        console.error(`重複する料理番号が検出されました: ${dishNumber}`);
        return;
      }
  
      // メニュー番号をセットに追加
      menuSet.add(dishNumber);
    }
  
    // 残りの行はイベント情報（注文受理または調理完了）
    const eventLines = lines.slice(currentLineIndex);
  
    // 注文管理用のマップを初期化
    const orderMap: Map<number, Array<number>> = new Map(); // 料理番号ごとに注文のテーブル番号をリストとして保持
  
    for (const eventLine of eventLines) {
      const parts = eventLine.trim().split(' ');
  
      if (parts[0] === 'received' && parts[1] === 'order') {
        // 注文受理情報の処理
        if (parts.length !== 4) {
          console.error(`受理された注文のフォーマットが無効です: ${eventLine}`);
          continue;
        }
  
        const tableNumber = parseInt(parts[2], 10);
        const dishNumber = parseInt(parts[3], 10);
  
        if (isNaN(tableNumber) || isNaN(dishNumber)) {
          console.error(`受理された注文の値が無効です: ${eventLine}`);
          continue;
        }
  
        if (!menuSet.has(dishNumber)) {
          // メニューに存在しない料理番号の場合は無視
          continue;
        }
  
        if (!orderMap.has(dishNumber)) {
          orderMap.set(dishNumber, []);
        }
        orderMap.get(dishNumber)!.push(tableNumber);
  
        // 受理された注文に対しては何も出力しません
  
      } else if (parts[0] === 'complete') {
        // 調理完了情報の処理
        if (parts.length !== 2) {
          console.error(`調理完了情報のフォーマットが無効です: ${eventLine}`);
          console.log(`unexpected input`);
          continue;
        }
  
        const dishNumber = parseInt(parts[1], 10);
  
        if (isNaN(dishNumber)) {
          console.error(`調理完了情報の値が無効です: ${eventLine}`);
          console.log(`unexpected input`);
          continue;
        }
  
        if (orderMap.has(dishNumber) && orderMap.get(dishNumber)!.length > 0) {
          // 対応する注文が存在する場合
          const tableNumber = orderMap.get(dishNumber)!.shift()!;
          console.log(`ready ${tableNumber} ${dishNumber}`);
        } else {
          // 対応する注文が存在しない場合
          console.log(`unexpected input`);
        }
  
      } else {
        // 不明なコマンドの場合
        console.error(`未知のコマンドが検出されました: ${eventLine}`);
        console.log(`unexpected input`);
      }
    }
  }
  
  
  // ステップ4の処理: 注文の管理、提供、会計申請を扱います。
  function handleStep4(lines: string[], startLine: number): void {
    let currentLineIndex = startLine;
  
    // メニュー項目の数を解析
    const numberOfMenuItems = parseInt(lines[currentLineIndex++].trim(), 10);
    if (isNaN(numberOfMenuItems) || numberOfMenuItems < 1 || numberOfMenuItems > 10000) {
      console.error('メニュー項目の数が無効です。1から10000の範囲で指定してください。');
      return;
    }
  
    // メニュー情報をマップに追加
    const menuPrices: Map<number, number> = new Map(); // 料理番号ごとの価格を保持
  
    for (let i = 0; i < numberOfMenuItems; i++) {
      if (currentLineIndex >= lines.length) {
        console.error('メニュー情報の行数が不足しています。');
        return;
      }
  
      const [dishStr, stockStr, priceStr] = lines[currentLineIndex++].trim().split(' ');
      const dishNumber = parseInt(dishStr, 10);
      const dishPrice = parseInt(priceStr, 10);
  
      // 入力値の検証
      if (isNaN(dishNumber) || isNaN(dishPrice)) {
        console.error('メニュー情報のフォーマットが無効です。');
        return;
      }
  
      if (
        dishNumber < 1 || dishNumber > 999999 ||
        dishPrice < 1 || dishPrice > 100000
      ) {
        console.error('メニュー情報の値が範囲外です。');
        return;
      }
  
      if (menuPrices.has(dishNumber)) {
        console.error(`重複する料理番号が検出されました: ${dishNumber}`);
        return;
      }
  
      // 料理番号と価格をマップに追加
      menuPrices.set(dishNumber, dishPrice);
    }
  
    // 残りの行はイベント情報（注文受理、注文提供、会計申請）
    const eventLines = lines.slice(currentLineIndex);
  
    // 注文管理用のデータ構造を初期化
    const seatOrders: Map<number, Map<number, number>> = new Map(); // 席番号ごとの注文内容 (料理番号 -> 数量)
    const seatServed: Map<number, Map<number, number>> = new Map(); // 席番号ごとの提供済み料理内容 (料理番号 -> 数量)
    const seatTotals: Map<number, number> = new Map(); // 席番号ごとの合計金額
  
    for (const eventLine of eventLines) {
      const parts = eventLine.trim().split(' ');
  
      if (parts[0] === 'received' && parts[1] === 'order') {
        // 注文受理情報の処理
        if (parts.length !== 4) {
          console.error(`受理された注文のフォーマットが無効です: ${eventLine}`);
          continue;
        }
  
        const tableNumber = parseInt(parts[2], 10);
        const dishNumber = parseInt(parts[3], 10);
  
        if (isNaN(tableNumber) || isNaN(dishNumber)) {
          console.error(`受理された注文の値が無効です: ${eventLine}`);
          continue;
        }
  
        if (!menuPrices.has(dishNumber)) {
          // メニューに存在しない料理番号の場合は無視
          continue;
        }
  
        // 席の注文情報を初期化
        if (!seatOrders.has(tableNumber)) {
          seatOrders.set(tableNumber, new Map());
          seatServed.set(tableNumber, new Map());
          seatTotals.set(tableNumber, 0);
        }
  
        const orders = seatOrders.get(tableNumber)!;
        orders.set(dishNumber, (orders.get(dishNumber) || 0) + 1);
  
        // 合計金額を更新
        seatTotals.set(tableNumber, seatTotals.get(tableNumber)! + menuPrices.get(dishNumber)!);
  
        // 受理された注文に対しては何も出力しません
  
      } else if (parts[0] === 'ready') {
        // 注文提供情報の処理
        if (parts.length !== 3) {
          console.error(`注文提供情報のフォーマットが無効です: ${eventLine}`);
          console.log(`unexpected input`);
          continue;
        }
  
        const tableNumber = parseInt(parts[1], 10);
        const dishNumber = parseInt(parts[2], 10);
  
        if (isNaN(tableNumber) || isNaN(dishNumber)) {
          console.error(`注文提供情報の値が無効です: ${eventLine}`);
          console.log(`unexpected input`);
          continue;
        }
  
        if (!seatOrders.has(tableNumber)) {
          // 注文が存在しない場合
          console.log(`unexpected input`);
          continue;
        }
  
        const orders = seatOrders.get(tableNumber)!;
        const served = seatServed.get(tableNumber)!;
  
        if (!orders.has(dishNumber) || (served.get(dishNumber) || 0) >= orders.get(dishNumber)!) {
          // 注文されていない料理の提供、または既に全て提供済みの場合
          console.log(`unexpected input`);
          continue;
        }
  
        // 提供された料理を記録
        served.set(dishNumber, (served.get(dishNumber) || 0) + 1);
  
        // 何も出力しません
  
      } else if (parts[0] === 'check') {
        // 会計申請情報の処理
        if (parts.length !== 2) {
          console.error(`会計申請情報のフォーマットが無効です: ${eventLine}`);
          console.log(`please wait`);
          continue;
        }
  
        const tableNumber = parseInt(parts[1], 10);
  
        if (isNaN(tableNumber)) {
          console.error(`会計申請情報の値が無効です: ${eventLine}`);
          console.log(`please wait`);
          continue;
        }
  
        if (!seatOrders.has(tableNumber)) {
          // 注文がない場合
          console.log(0);
          continue;
        }
  
        const orders = seatOrders.get(tableNumber)!;
        const served = seatServed.get(tableNumber)!;
  
        // 全ての注文が提供されているか確認
        let allServed = true;
        for (const [dishNumber, quantity] of orders.entries()) {
          if ((served.get(dishNumber) || 0) < quantity) {
            allServed = false;
            break;
          }
        }
  
        if (allServed) {
          // 全て提供されている場合、合計金額を出力
          const totalAmount = seatTotals.get(tableNumber)!;
          console.log(totalAmount);
  
          // 席のデータをリセット
          seatOrders.delete(tableNumber);
          seatServed.delete(tableNumber);
          seatTotals.delete(tableNumber);
        } else {
          // 提供が完了していない場合
          console.log(`please wait`);
        }
  
      } else {
        // 不明なコマンドの場合
        console.error(`未知のコマンドが検出されました: ${eventLine}`);
        console.log(`unexpected input`);
      }
    }
  }
  
  
  function readFromStdin(): Promise<string[]> {
    return new Promise(resolve => {
      let data: string = "";
      process.stdin.resume();
      process.stdin.setEncoding("utf8");
  
      process.stdin.on("data", chunk => {
        data += chunk;
      });
  
      process.stdin.on("end", () => {
        // 最後の改行を削除してから行に分割
        resolve(data.trim().split('\n'));
      });
    });
  }
  
  // 標準入力からデータを読み取り、メイン関数を実行
  readFromStdin().then(main);
  