import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface MenuItem {
  id: number;
  name: string;
  price: number;
  description?: string;
}

const Menu: React.FC = () => {
  const [menu, setMenu] = useState<MenuItem[]>([]);

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

  return (
    <div>
      <h1>メニュー</h1>
      <ul>
        {menu.map(item => (
          <li key={item.id}>
            <strong>{item.name}</strong> - ¥{item.price}
            <p>{item.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Menu;
