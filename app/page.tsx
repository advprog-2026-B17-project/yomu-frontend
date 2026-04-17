'use client';

import { useState, useEffect } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface User {
  id: number;
  username: string;
  email: string;
}

export default function Home() {
  return (
      <div>Home Page</div>
  );
}