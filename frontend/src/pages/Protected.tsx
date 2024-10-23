import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Protected: React.FC = () => {
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const fetchProtected = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/protected', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessage(response.data);
      } catch (error) {
        console.error('保護されたルートへのアクセスに失敗しました。', error);
        setMessage('アクセスが拒否されました。');
      }
    };

    fetchProtected();
  }, []);

  return (
    <div>
      <h1>保護されたページ</h1>
      <p>{message}</p>
    </div>
  );
};

export default Protected;
