import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [role, setRole] = useState<string>('customer');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/auth/register', { username, password, role });
      alert('登録が成功しました！');
      navigate('/login');
    } catch (error) {
      console.error('登録に失敗しました。', error);
    }
  };

  return (
    <div>
      <h1>登録</h1>
      <form onSubmit={handleSubmit}>
        <label>
          ユーザー名:
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          パスワード:
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          ロール:
          <select value={role} onChange={e => setRole(e.target.value)} required>
            <option value="customer">顧客</option>
            <option value="staff">スタッフ</option>
          </select>
        </label>
        <br />
        <button type="submit">登録する</button>
      </form>
    </div>
  );
};

export default Register;
