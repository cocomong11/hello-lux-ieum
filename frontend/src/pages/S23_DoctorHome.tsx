import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/DoctorHeader';

const DESIGN_W = 1920;
const DESIGN_H = 1080;

export default function S23_DoctorHome() {
  const navigate = useNavigate();
  return (
    <div style={{
          width: '100%', minHeight: '100vh', backgroundColor: '#FFFFFF',
          fontFamily: 'Pretendard Variable, Inter, sans-serif',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          boxSizing: 'border-box', paddingBottom: '120px', position: 'relative'
        }}>
            <Header/>
      <div className='min-h-screen flex items-center justify-center text-neutral-10 text-[28px] font-bold'>
        S23_DH
      </div>
    </div>
  );
}
