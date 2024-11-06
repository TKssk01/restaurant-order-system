function main(lines: string[]) {
    let currentLine = 0;
  
    // ステップ番号の確認
    const step = parseInt(lines[currentLine++].trim());
    if (isNaN(step) || !(step >= 1 && step <= 4)) {
      console.error('Unsupported step number. Expected step 1, 2, 3, or 4.');
      return;
    }
  
    switch (step) {
      case 1:
        handleStep1(lines, currentLine);
        break;
      case 2:
        handleStep2(lines, currentLine);
        break;
      case 3:
        handleStep3(lines, currentLine);
        break;
      case 4:
        handleStep4(lines, currentLine);
        break;
      default:
        console.error('Unsupported step number.');
    }
  }
  
  
  function handleStep1(lines: string[], startLine: number) {
    let currentLine = startLine;
  
    // 2. メニューの種類数Mを読み取る
    const M = parseInt(lines[currentLine++].trim());
    if (isNaN(M) || M < 1 || M > 10000) {
      console.error('Invalid number of menu items.');
      return;
    }
  
    // 3. メニュー情報を読み取る
    const menuMap: Map<number, { stock: number; price: number }> = new Map();
  
    for (let i = 0; i < M; i++) {
      if (currentLine >= lines.length) {
        console.error('Insufficient menu information lines.');
        return;
      }
  
      const [D_str, S_str, P_str] = lines[currentLine++].trim().split(' ');
      const D = parseInt(D_str);
      const S = parseInt(S_str);
      const P = parseInt(P_str);
  
      if (isNaN(D) || isNaN(S) || isNaN(P)) {
        console.error('Invalid menu information format.');
        return;
      }
  
      if (D < 1 || D > 999999 || S < 1 || S > 10000 || P < 1 || P > 100000) {
        console.error('Menu information values out of bounds.');
        return;
      }
  
      if (menuMap.has(D)) {
        console.error(`Duplicate dish number detected: ${D}`);
        return;
      }
  
      menuMap.set(D, { stock: S, price: P });
    }
  
    // 4. 残りの行は注文情報
    const orders = lines.slice(currentLine);
  
    for (const orderLine of orders) {
      const parts = orderLine.trim().split(' ');
      if (parts.length !== 4 || parts[0] !== 'order') {
        console.error(`Invalid order format: ${orderLine}`);
        continue; // フォーマットが正しくない場合はスキップ
      }
  
      const T = parseInt(parts[1]);
      const D = parseInt(parts[2]);
      const N = parseInt(parts[3]);
  
      if (isNaN(T) || isNaN(D) || isNaN(N)) {
        console.error(`Invalid order values: ${orderLine}`);
        continue; // 値が数値でない場合はスキップ
      }
  
      if (T < 1 || T > 10000 || D < 1 || D > 999999 || N < 1 || N > 99) {
        console.error(`Order values out of bounds: ${orderLine}`);
        continue; // 値が範囲外の場合はスキップ
      }
  
      if (!menuMap.has(D)) {
        // 料理番号が存在しない場合は sold out を出力
        console.log(`sold out ${T}`);
        continue;
      }
  
      const menuItem = menuMap.get(D)!;
  
      if (menuItem.stock >= N) {
        // 在庫が十分にある場合、注文を受理し出力
        for (let i = 0; i < N; i++) {
          console.log(`received order ${T} ${D}`);
        }
        menuItem.stock -= N; // 在庫を減少
      } else {
        // 在庫が不足している場合、sold out を出力
        console.log(`sold out ${T}`);
      }
    }
  }
  
  function handleStep2(lines: string[], startLine: number) {
    let currentLine = startLine;
  
    // 2. メニュー数Mと電子レンジの数Kを読み取る
    if (currentLine >= lines.length) {
      console.error('Missing M and K values.');
      return;
    }
    const [M_str, K_str] = lines[currentLine++].trim().split(' ');
    const M = parseInt(M_str);
    const K = parseInt(K_str);
  
    if (isNaN(M) || isNaN(K) || M < 1 || M > 10000 || K < 1 || K > 1000) {
      console.error('Invalid M or K values.');
      return;
    }
  
    // 3. メニュー情報を読み取る
    const menuSet: Set<number> = new Set();
  
    for (let i = 0; i < M; i++) {
      if (currentLine >= lines.length) {
        console.error('Insufficient menu information lines.');
        return;
      }
  
      const [D_str, P_str] = lines[currentLine++].trim().split(' ');
      const D = parseInt(D_str);
      const P = parseInt(P_str);
  
      if (isNaN(D) || isNaN(P)) {
        console.error('Invalid menu information format.');
        return;
      }
  
      if (D < 1 || D > 999999 || P < 1 || P > 100000) {
        console.error('Menu information values out of bounds.');
        return;
      }
  
      if (menuSet.has(D)) {
        console.error(`Duplicate dish number detected: ${D}`);
        return;
      }
  
      menuSet.add(D);
    }
  
    // 4. 残りの行は注文受理情報または料理完了情報
    const events = lines.slice(currentLine);
  
    // 電子レンジの状態管理
    let availableMicrowaves = K;
    const cookingMap: Map<number, number> = new Map(); // 現在調理中の料理番号とその数
    const orderQueue: Array<{ T: number; D: number }> = []; // 待機中の注文
  
    for (const eventLine of events) {
      const parts = eventLine.trim().split(' ');
  
      if (parts[0] === 'received' && parts[1] === 'order') {
        // 注文受理情報
        if (parts.length !== 4) {
          console.error(`Invalid received order format: ${eventLine}`);
          console.log(`wait`);
          continue;
        }
  
        const T = parseInt(parts[2]);
        const D = parseInt(parts[3]);
  
        if (isNaN(T) || isNaN(D)) {
          console.error(`Invalid received order values: ${eventLine}`);
          console.log(`wait`);
          continue;
        }
  
        if (!menuSet.has(D)) {
          // メニューに存在しない料理番号
          console.log(`sold out ${T}`);
          continue;
        }
  
        if (availableMicrowaves > 0) {
          // 電子レンジが空いているので調理を開始
          availableMicrowaves--;
          cookingMap.set(D, (cookingMap.get(D) || 0) + 1);
          console.log(`${D}`);
        } else {
          // 電子レンジが全て使用中なので待機キューに入れる
          orderQueue.push({ T, D });
          console.log(`wait`);
        }
  
      } else if (parts[0] === 'complete') {
        // 調理完了情報
        if (parts.length !== 2) {
          console.error(`Invalid complete format: ${eventLine}`);
          console.log(`unexpected input`);
          continue;
        }
  
        const D = parseInt(parts[1]);
  
        if (isNaN(D)) {
          console.error(`Invalid complete values: ${eventLine}`);
          console.log(`unexpected input`);
          continue;
        }
  
        if (cookingMap.has(D) && cookingMap.get(D)! > 0) {
          // 調理中の料理が完了
          cookingMap.set(D, cookingMap.get(D)! - 1);
          if (cookingMap.get(D)! === 0) {
            cookingMap.delete(D);
          }
          availableMicrowaves++;
  
          if (orderQueue.length > 0) {
            // 待機キューに注文があるので次の注文を調理
            const nextOrder = orderQueue.shift()!;
            const nextD = nextOrder.D;
  
            cookingMap.set(nextD, (cookingMap.get(nextD) || 0) + 1);
            availableMicrowaves--;
            console.log(`ok ${nextD}`);
          } else {
            // 待機キューに注文がない
            console.log(`ok`);
          }
        } else {
          // 調理中でない料理が完了情報として来た
          console.log(`unexpected input`);
        }
  
      } else {
        // 不明なコマンド
        console.error(`Unknown command: ${eventLine}`);
        console.log(`unexpected input`);
      }
    }
  }
  
  
  
  function handleStep3(lines: string[], startLine: number) {
    let currentLine = startLine;
  
    // 2. メニューの種類数Mを読み取る
    const M = parseInt(lines[currentLine++].trim());
    if (isNaN(M) || M < 1 || M > 10000) {
      console.error('Invalid number of menu items.');
      return;
    }
  
    // 3. メニュー情報を読み取る
    const menuSet: Set<number> = new Set();
  
    for (let i = 0; i < M; i++) {
      if (currentLine >= lines.length) {
        console.error('Insufficient menu information lines.');
        return;
      }
  
      const [D_str, P_str] = lines[currentLine++].trim().split(' ');
      const D = parseInt(D_str);
      const P = parseInt(P_str);
  
      if (isNaN(D) || isNaN(P)) {
        console.error('Invalid menu information format.');
        return;
      }
  
      if (D < 1 || D > 999999 || P < 1 || P > 100000) {
        console.error('Menu information values out of bounds.');
        return;
      }
  
      if (menuSet.has(D)) {
        console.error(`Duplicate dish number detected: ${D}`);
        return;
      }
  
      menuSet.add(D);
    }
  
    // 4. 残りの行は注文受理情報または料理完了情報
    const events = lines.slice(currentLine);
  
    // 注文受理情報を管理するためのデータ構造
    const orderMap: Map<number, Array<number>> = new Map(); // D -> [T1, T2, ...]
  
    for (const eventLine of events) {
      const parts = eventLine.trim().split(' ');
  
      if (parts[0] === 'received' && parts[1] === 'order') {
        // 注文受理情報
        if (parts.length !== 4) {
          console.error(`Invalid received order format: ${eventLine}`);
          continue;
        }
  
        const T = parseInt(parts[2]);
        const D = parseInt(parts[3]);
  
        if (isNaN(T) || isNaN(D)) {
          console.error(`Invalid received order values: ${eventLine}`);
          continue;
        }
  
        if (!menuSet.has(D)) {
          // メニューに存在しない料理番号
          continue; // 出力は不要
        }
  
        if (!orderMap.has(D)) {
          orderMap.set(D, []);
        }
        orderMap.get(D)!.push(T);
  
        // 注文受理情報に対しては何も出力しません
      } else if (parts[0] === 'complete') {
        // 調理完了情報
        if (parts.length !== 2) {
          console.error(`Invalid complete format: ${eventLine}`);
          console.log(`unexpected input`);
          continue;
        }
  
        const D = parseInt(parts[1]);
  
        if (isNaN(D)) {
          console.error(`Invalid complete values: ${eventLine}`);
          console.log(`unexpected input`);
          continue;
        }
  
        if (orderMap.has(D) && orderMap.get(D)!.length > 0) {
          // 対応する注文が存在する
          const T = orderMap.get(D)!.shift()!; // 最も古いTを取得
          console.log(`ready ${T} ${D}`);
        } else {
          // 対応する注文が存在しない
          console.log(`unexpected input`);
        }
      } else {
        // 不明なコマンド
        console.error(`Unknown command: ${eventLine}`);
        console.log(`unexpected input`);
      }
    }
  }
  
  
  
  function handleStep4(lines: string[], startLine: number) {
    let currentLine = startLine;
  
    // 2. メニューの種類数Mを読み取る
    const M = parseInt(lines[currentLine++].trim());
    if (isNaN(M) || M < 1 || M > 10000) {
      console.error('Invalid number of menu items.');
      return;
    }
  
    // 3. メニュー情報を読み取る
    const menuMap: Map<number, number> = new Map(); // D -> P
  
    for (let i = 0; i < M; i++) {
      if (currentLine >= lines.length) {
        console.error('Insufficient menu information lines.');
        return;
      }
  
      const [D_str, S_str, P_str] = lines[currentLine++].trim().split(' ');
      const D = parseInt(D_str);
      // Sはステップ4では不要
      const P = parseInt(P_str);
  
      if (isNaN(D) || isNaN(P)) {
        console.error('Invalid menu information format.');
        return;
      }
  
      if (D < 1 || D > 999999 || P < 1 || P > 100000) {
        console.error('Menu information values out of bounds.');
        return;
      }
  
      if (menuMap.has(D)) {
        console.error(`Duplicate dish number detected: ${D}`);
        return;
      }
  
      menuMap.set(D, P);
    }
  
    // 4. 残りの行は注文受理情報、注文提供情報、会計申請情報
    const events = lines.slice(currentLine);
  
    // 注文管理
    const seatOrders: Map<number, Map<number, number>> = new Map(); // T -> (D -> count)
    const seatServed: Map<number, Map<number, number>> = new Map(); // T -> (D -> count)
    const seatTotals: Map<number, number> = new Map(); // T -> total price
  
    for (const eventLine of events) {
      const parts = eventLine.trim().split(' ');
  
      if (parts[0] === 'received' && parts[1] === 'order') {
        // 注文受理情報
        if (parts.length !== 4) {
          console.error(`Invalid received order format: ${eventLine}`);
          continue;
        }
  
        const T = parseInt(parts[2]);
        const D = parseInt(parts[3]);
  
        if (isNaN(T) || isNaN(D)) {
          console.error(`Invalid received order values: ${eventLine}`);
          continue;
        }
  
        if (!menuMap.has(D)) {
          // メニューに存在しない料理番号
          continue; // 出力は不要
        }
  
        if (!seatOrders.has(T)) {
          seatOrders.set(T, new Map());
          seatServed.set(T, new Map());
          seatTotals.set(T, 0);
        }
  
        const orders = seatOrders.get(T)!;
        orders.set(D, (orders.get(D) || 0) + 1);
  
        // 合計金額の更新
        seatTotals.set(T, seatTotals.get(T)! + menuMap.get(D)!);
  
        // 注文受理情報に対しては何も出力しません
  
      } else if (parts[0] === 'ready') {
        // 注文提供情報
        if (parts.length !== 3) {
          console.error(`Invalid ready format: ${eventLine}`);
          continue; // 出力は不要
        }
  
        const T = parseInt(parts[1]);
        const D = parseInt(parts[2]);
  
        if (isNaN(T) || isNaN(D)) {
          console.error(`Invalid ready values: ${eventLine}`);
          continue; // 出力は不要
        }
  
        if (!seatOrders.has(T)) {
          // 注文が存在しない
          console.error(`Unexpected ready event for seat ${T} with dish ${D}`);
          continue; // 出力は不要
        }
  
        const orders = seatOrders.get(T)!;
        const served = seatServed.get(T)!;
  
        if (!orders.has(D) || served.get(D)! >= orders.get(D)!) {
          // 注文されていない料理の提供、または既に全て提供済み
          console.error(`Unexpected dish number or over-served for seat ${T}: ${D}`);
          continue; // 出力は不要
        }
  
        // 正常に提供された場合
        served.set(D, (served.get(D) || 0) + 1);
  
        // 注文提供情報に対しては何も出力しません
  
      } else if (parts[0] === 'check') {
        // 会計申請情報
        if (parts.length !== 2) {
          console.error(`Invalid check format: ${eventLine}`);
          console.log(`please wait`); // 出力は期待値に合わせて適宜
          continue;
        }
  
        const T = parseInt(parts[1]);
  
        if (isNaN(T)) {
          console.error(`Invalid check values: ${eventLine}`);
          console.log(`please wait`); // 出力は期待値に合わせて適宜
          continue;
        }
  
        if (!seatOrders.has(T)) {
          // 注文がない場合
          console.log(0);
          continue;
        }
  
        const orders = seatOrders.get(T)!;
        const served = seatServed.get(T)!;
  
        let allServed = true;
        for (const [D, count] of orders.entries()) {
          if ((served.get(D) || 0) < count) {
            allServed = false;
            break;
          }
        }
  
        if (allServed) {
          const total = seatTotals.get(T)!;
          console.log(total);
  
          // 席のデータをリセット
          seatOrders.delete(T);
          seatServed.delete(T);
          seatTotals.delete(T);
        } else {
          console.log(`please wait`);
        }
  
      } else {
        // 不明なコマンド
        console.error(`Unknown command: ${eventLine}`);
        continue; // 出力は不要
      }
    }
  }
  
  
  
  
  
  
  
  function readFromStdin(): Promise<string[]> {
    return new Promise(resolve => {
      let data: string = "";
      process.stdin.resume();
      process.stdin.setEncoding("utf8");
  
      process.stdin.on("data", d => {
        data += d;
      });
      process.stdin.on("end", () => {
        // 最後の改行を削除してから行に分割
        resolve(data.trim().split('\n'));
      });
    })
  }
  
  readFromStdin().then(main)
  