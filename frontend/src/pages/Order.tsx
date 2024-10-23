import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface MenuItem {
  id: number;
  name: string;
  price: number;
}

const Order: React.FC = () => {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [selectedMenuId, setSelectedMenuId] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await axios.get('http://localhost:3000/menu');
        setMenu(response.data);
      } catch (error) {
        console.error('メニューの取得に失敗しました。', error);
      }
    };

    fetchMenu();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token'); // JWTトークンを取得
      await axios.post(
        'http://localhost:3000/orders',
        { menuId: selectedMenuId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('注文が成功しました！');
    } catch (error) {
      console.error('注文に失敗しました。', error);
    }
  };

  return (
    <div>
      <h1>注文</h1>
      <form onSubmit={handleSubmit}>
        <label>
          メニュー:
          <select
            value={selectedMenuId}
            onChange={e => setSelectedMenuId(Number(e.target.value))}
            required
          >
            <option value="" disabled>選択してください</option>
            {menu.map(item => (
              <option key={item.id} value={item.id}>
                {item.name} - ¥{item.price}
              </option>
            ))}
          </select>
        </label>
        <br />
        <label>
          数量:
          <input
            type="number"
            value={quantity}
            onChange={e => setQuantity(Number(e.target.value))}
            min="1"
            required
          />
        </label>
        <br />
        <button type="submit">注文する</button>
      </form>
    </div>
  );
};

export default Order;
