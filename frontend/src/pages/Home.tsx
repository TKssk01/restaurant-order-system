import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div>
      <h1>レストラン注文システム</h1>
      <nav>
        <ul>
          <li><Link to="/menu">メニュー</Link></li>
          <li><Link to="/order">注文</Link></li>
          <li><Link to="/register">登録</Link></li>
          <li><Link to="/login">ログイン</Link></li>
        </ul>
      </nav>
    </div>
  );
};

export default Home;
