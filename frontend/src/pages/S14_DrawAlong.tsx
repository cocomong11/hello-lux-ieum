import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/patientHeader';
import UpLoadingIcon from '../assets/up-loading.png';

export default function S14_DrawAlong() {
  const navigate = useNavigate();
  const [selectedEvaluation, setSelectedEvaluation] = useState<string | null>(null);
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [duration, setDuration] = useState('약 3분');
  const [memo, setMemo] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);

  // 관찰 체크리스트 
  const [checklist, setChecklist] = useState({
    item1: true,
    item2: false,
    item3: true,
    item4: false,
    item5: false,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFileName(e.target.files[0].name);
    }
  };

  return (
    <div style={{
      width: '100vw',
      minHeight: '100vh',
      backgroundColor: '#FFFFFF',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      overflowX: 'hidden'
    }}>
      
      <Header />

     
      <main style={{
        width: '648px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        paddingTop: '40px',
        paddingBottom: '80px',
        boxSizing: 'border-box'
      }}>

       
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <div style={{
            height: '42px', borderRadius: '50px', background: '#4188ED',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 20px'
          }}>
            <span style={{ fontFamily: "'Pretendard Variable', Pretendard, sans-serif", fontWeight: 700, fontSize: '22px', color: '#FFFFFF' }}>
              그림 인지 활동 (오프라인)
            </span>
          </div>
          <div style={{
            height: '42px', borderRadius: '50px', background: '#DFDF87',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 20px'
          }}>
            <span style={{ fontFamily: "'Pretendard Variable', Pretendard, sans-serif", fontWeight: 700, fontSize: '22px', color: '#0D0D0D' }}>
              보호자 체크 필요
            </span>
          </div>
        </div>

       
        <h1 style={{
          margin: '0 0 20px 0', fontFamily: "'Pretendard Variable', Pretendard, sans-serif", fontWeight: 700, fontSize: '30px', lineHeight: '140%', color: '#0D0D0D'
        }}>
          아래 제시된 그림을 따라 그려 주세요.
        </h1>

       
        <div style={{
          width: '648px',
          height: '148px',
          borderRadius: '10px',
          background: '#4188ED0D',
          border: '1px solid #8E8E98',
          boxShadow: '0px 0px 4px 0px #4188ED',
          boxSizing: 'border-box',
          padding: '23px 29px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start'
        }}>
         
          <ol style={{
            width: '491px',
            height: '102px',
            margin: 0,
            padding: 0,
            listStylePosition: 'inside',
            textAlign: 'left',
            fontFamily: "'Pretendard Variable', Pretendard, sans-serif",
            fontWeight: 400,
            fontSize: '22px',
            lineHeight: '155%',
            color: '#0D0D0D',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            boxSizing: 'border-box'
          }}>
            <li style={{ listStyle: 'none' }}>1. 화면의 그림을 환자분께 보여주세요.</li>
            <li style={{ listStyle: 'none' }}>2. 종이와 펜으로 직접 따라 그리도록 안내해 주세요.</li>
            <li style={{ listStyle: 'none' }}>3. 보호자가 결과를 보고 아래 체크 항목으로 평가합니다.</li>
          </ol>
        </div>

        
        <button
          onClick={() => setIsAudioPlaying(!isAudioPlaying)}
          style={{
            width: '154px',
            height: '46px',
            borderRadius: '10px',
            padding: '6px 19px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            boxSizing: 'border-box',
            cursor: 'pointer',
            marginBottom: '28px',
            transition: 'all 0.15s ease',
            background: isAudioPlaying ? '#0F66E2' : '#4188ED0D',
            border: isAudioPlaying ? '1px solid #DFDF87' : '1px solid #0F66E2',
            boxShadow: '0px 0px 4px 0px #0F66E2'
          }}
        >
          {isAudioPlaying ? (
            <>
              <span style={{ color: '#FFFFFF', fontSize: '18px', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>↻</span>
              <span style={{ fontFamily: "'Pretendard Variable', Pretendard, sans-serif", fontWeight: 700, fontSize: '18px', color: '#FFFFFF', lineHeight: '155%' }}>다시 듣기</span>
            </>
          ) : (
            <>
              <span style={{ color: '#0F66E2', fontSize: '18px', display: 'flex', alignItems: 'center' }}>▶</span>
              <span style={{ fontFamily: "'Pretendard Variable', Pretendard, sans-serif", fontWeight: 700, fontSize: '18px', color: '#0F66E2', lineHeight: '155%' }}>안내 듣기</span>
            </>
          )}
        </button>

       
        <div style={{
          width: '648px',
          height: '725px',
          borderRadius: '10px',
          background: '#4188ED0D',
          padding: '23px 24px 24px 24px',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          marginBottom: '32px'
        }}>
         
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            
            <h2 style={{
              width: '182px',
              height: '34px',
              margin: '0 0 14px 0',
              fontFamily: "'Pretendard Variable', Pretendard, sans-serif",
              fontWeight: 700,
              fontSize: '22px',
              lineHeight: '155%',
              color: '#0D0D0D',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center'
            }}>
              환자에게 보여줄 그림
            </h2>

            <div style={{
              width: '600px',
              height: '282px',
              borderRadius: '10px',
              background: '#D9D9D9',
              border: '1px solid #8E8E98',
              boxShadow: '0px 0px 4px 0px #4188ED',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ fontFamily: "'Pretendard Variable', Pretendard, sans-serif", fontWeight: 400, fontSize: '22px', color: '#797980' }}>(제시 그림)</span>
            </div>

          
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', width: '100%', marginTop: '14px' }}>
              <button
                onClick={() => window.open('about:blank', '_blank')}
                style={{
                  width: '120px',
                  height: '46px',
                  borderRadius: '10px',
                  border: '1px solid #8E8E98',
                  background: '#FFFFFF',
                  padding: '6px 19px',
                  gap: '10px',
                  boxSizing: 'border-box',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: "'Pretendard Variable', Pretendard, sans-serif",
                  fontWeight: 700,
                  fontSize: '16px',
                  color: '#0D0D0D',
                  boxShadow: '0px 0px 4px 0px #0F66E2',
                  cursor: 'pointer'
                }}
              >
                크게 보기
              </button>
              <button
                onClick={() => window.print()}
                style={{
                  width: '142px',
                  height: '46px',
                  borderRadius: '10px',
                  border: '1px solid #8E8E98',
                  background: '#FFFFFF',
                  padding: '6px 19px',
                  gap: '10px',
                  boxSizing: 'border-box',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: "'Pretendard Variable', Pretendard, sans-serif",
                  fontWeight: 700,
                  fontSize: '16px',
                  color: '#0D0D0D',
                  boxShadow: '0px 0px 4px 0px #0F66E2',
                  cursor: 'pointer'
                }}
              >
                인쇄용 PDF
              </button>
            </div>
          </div>

         
          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              style={{ display: 'none' }}
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                width: '600px',
                height: '166px',
                borderRadius: '10px',
                background: '#D9D9D933',
                border: '1px solid #8E8E98',
                boxShadow: '0px 0px 4px 0px #4188ED',
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                padding: '16px'
              }}
            >
              <p style={{
                margin: 0, fontFamily: "'Pretendard Variable', Pretendard, sans-serif", fontWeight: 400, fontSize: '22px',
                lineHeight: '155%', color: '#797980', textAlign: 'center'
              }}>
                종이에 그린 그림 사진 올리기
              </p>
              <p style={{
                margin: '4px 0 0 0', fontFamily: "'Pretendard Variable', Pretendard, sans-serif", fontWeight: 400, fontSize: '16px',
                color: '#999999', textAlign: 'center'
              }}>
                보호자가 직접 촬영하여 업로드 해주세요. (JPG/PNG 최대 5MB)
              </p>
              <img
                src={UpLoadingIcon}
                alt="업로드 아이콘"
                style={{ width: '36px', height: '36px', display: 'block', margin: '8px auto 0 auto', opacity: 0.4 }}
              />

              {uploadedFileName && (
                <div style={{
                  marginTop: '8px', padding: '4px 12px', borderRadius: '20px', background: '#0F66E2', color: '#FFF', fontSize: '13px', fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  📎 {uploadedFileName} 선택됨
                </div>
              )}
            </div>

            <p style={{
              margin: '10px 0 0 0',
              fontFamily: "'Pretendard Variable', Pretendard, sans-serif",
              fontWeight: 400,
              fontSize: '18px',
              lineHeight: '155%',
              color: '#0D0D0D',
              textAlign: 'left'
            }}>
              *사진을 올리지 않아도 아래 체크리스트만으로 기록할 수 있습니다.
            </p>
          </div>
        </div>

        {/* 보호자 평가 · 수행 정도 */}
        <h2 style={{ margin: '0 0 14px 0', fontFamily: "'Pretendard Variable', Pretendard, sans-serif", fontWeight: 700, fontSize: '22px', color: '#0D0D0D' }}>
          보호자 평가 · 수행 정도
        </h2>

        {/* A, B, C, D 박스들  */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '18px',
          width: '648px',
          marginBottom: '32px'
        }}>
          {[
            { id: 'A', title: 'A', desc: '잘 그렸음', sub: '원본과 거의 유사' },
            { id: 'B', title: 'B', desc: '부분적으로 그렸음', sub: '일부 형태 누락' },
            { id: 'C', title: 'C', desc: '그리기 어려워함', sub: '형태 구분 어려움' },
            { id: 'D', title: 'D', desc: '그리기 거부함', sub: '시도하지 않음' }
          ].map((box) => {
            const isSelected = selectedEvaluation === box.id;

            const activeBoxStyle = {
              background: '#0F66E2',
              border: '1px solid #DFDF87',
              boxShadow: '0px 0px 4px 0px #2073E8',
              titleColor: '#FFFFFF',
              textColor: '#FFFFFF',
              subColor: '#E0E8FF'
            };

            const defaultBoxStyle = {
              background: '#F8F9FA',
              border: '1px solid #8E8E98',
              boxShadow: '0px 0px 4px 0px #797980',
              titleColor: '#0D0D0D',
              textColor: '#0D0D0D',
              subColor: '#797980'
            };

            const styleState = isSelected ? activeBoxStyle : defaultBoxStyle;

            return (
              <div
                key={box.id}
                onClick={() => setSelectedEvaluation(box.id)}
                style={{
                  width: '315px',
                  height: '147px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  padding: '16px 20px',
                  boxSizing: 'border-box',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.15s ease',
                  background: styleState.background,
                  border: styleState.border,
                  boxShadow: styleState.boxShadow
                }}
              >
                <span style={{
                  fontFamily: "'Pretendard Variable', Pretendard, sans-serif",
                  fontWeight: 700,
                  fontSize: '30px',
                  lineHeight: '140%',
                  textAlign: 'center',
                  color: styleState.titleColor,
                  marginBottom: '2px'
                }}>{box.title}</span>

                <span style={{
                  fontFamily: "'Pretendard Variable', Pretendard, sans-serif", fontWeight: 400, fontSize: '18px',
                  color: styleState.textColor
                }}>{box.desc}</span>

                <span style={{
                  fontFamily: "'Pretendard Variable', Pretendard, sans-serif", fontWeight: 400, fontSize: '14px',
                  color: styleState.subColor, marginTop: '2px'
                }}>{box.sub}</span>
              </div>
            );
          })}
        </div>

        {/* 관찰 체크리스트 */}
        <h2 style={{ margin: '0 0 14px 0', fontFamily: "'Pretendard Variable', Pretendard, sans-serif", fontWeight: 700, fontSize: '22px', color: '#0D0D0D' }}>
          관찰 체크리스트
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%', marginBottom: '32px' }}>
          {[
            { key: 'item1', label: '지붕/벽/문 등 주요 요소 포함' },
            { key: 'item2', label: '전체적인 비율/형태 유지' },
            { key: 'item3', label: '선이 흔들리거나 끊김' },
            { key: 'item4', label: '중간에 멈춤/혼란' },
            { key: 'item5', label: '보호자 안내 · 도움 필요' }
          ].map((item) => {
            const isChecked = checklist[item.key as keyof typeof checklist];
            return (
              <div
                key={item.key}
                onClick={() => setChecklist(prev => ({ ...prev, [item.key]: !isChecked }))}
                style={{ display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer' }}
              >
                <div style={{
                  width: '26px', height: '26px', borderRadius: '4px', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s ease',
                  border: isChecked ? '1px solid #DFDF87' : '1px solid #8E8E98',
                  background: isChecked ? '#0F66E2' : '#F8F9FA',
                  boxShadow: isChecked ? '0px 0px 4px 0px #2073E8' : 'none'
                }}>
                  {isChecked && <span style={{ color: '#FFFFFF', fontSize: '16px', fontWeight: 'bold' }}>✓</span>}
                </div>
                <span style={{
                  fontFamily: "'Pretendard Variable', Pretendard, sans-serif", fontWeight: 400, fontSize: '22px', color: '#0D0D0D'
                }}>
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* 소요 시간 */}
        <h2 style={{ margin: '0 0 12px 0', fontFamily: "'Pretendard Variable', Pretendard, sans-serif", fontWeight: 700, fontSize: '22px', color: '#0D0D0D' }}>
          소요 시간
        </h2>
        <div style={{
          width: '100%', height: '79px', borderRadius: '10px', background: '#4188ED0D',
          border: '1px solid #8E8E98', boxShadow: '0px 0px 4px 0px #4188ED',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 24px', boxSizing: 'border-box', marginBottom: '32px'
        }}>
          <input
            type="text"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            style={{
              width: '100%', background: 'transparent', border: 'none', outline: 'none',
              fontFamily: "'Pretendard Variable', Pretendard, sans-serif", fontWeight: 400, fontSize: '22px', color: '#0D0D0D'
            }}
          />
        </div>

        {/* 활동 중 감정 상태 */}
        <h2 style={{ margin: '0 0 14px 0', fontFamily: "'Pretendard Variable', Pretendard, sans-serif", fontWeight: 700, fontSize: '22px', color: '#0D0D0D' }}>
          활동 중 감정 상태
        </h2>
        <div style={{ display: 'flex', gap: '16px', width: '100%', flexWrap: 'wrap', marginBottom: '32px' }}>
          {[
            { name: '집중', width: '77px' },
            { name: '즐거움', width: '96px' },
            { name: '불안', width: '77px' },
            { name: '짜증', width: '77px' },
            { name: '무관심', width: '96px' }
          ].map((emotion) => {
            const isSelected = selectedEmotion === emotion.name;

            const activeStyle = {
              background: '#0F66E2',
              border: '1px solid #DFDF87',
              boxShadow: '0px 0px 4px 0px #4188ED',
              color: '#FFFFFF'
            };

            const defaultStyle = {
              background: '#F8F9FA',
              border: '1px solid #8E8E98',
              boxShadow: '0px 0px 4px 0px #797980',
              color: '#797980'
            };

            const currentStyle = isSelected ? activeStyle : defaultStyle;

            return (
              <button
                key={emotion.name}
                onClick={() => setSelectedEmotion(emotion.name)}
                style={{
                  width: emotion.width,
                  height: '46px',
                  borderRadius: '10px',
                  padding: '6px 19px',
                  boxSizing: 'border-box',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  fontFamily: "'Pretendard Variable', Pretendard, sans-serif",
                  fontWeight: 400,
                  fontSize: '18px',
                  lineHeight: '155%',
                  textAlign: 'center',
                  background: currentStyle.background,
                  border: currentStyle.border,
                  boxShadow: currentStyle.boxShadow,
                  color: currentStyle.color
                }}
              >
                {emotion.name}
              </button>
            );
          })}
        </div>

        {/* 보호자 메모 */}
        <h2 style={{ margin: '0 0 12px 0', fontFamily: "'Pretendard Variable', Pretendard, sans-serif", fontWeight: 700, fontSize: '22px', color: '#0D0D0D' }}>
          보호자 메모 (선택)
        </h2>
        <div style={{
          width: '100%', borderRadius: '10px', background: '#4188ED0D',
          border: '1px solid #8E8E98', boxShadow: '0px 0px 4px 0px #4188ED',
          padding: '20px 24px', boxSizing: 'border-box', marginBottom: '32px'
        }}>
          <textarea
            value={memo}
            placeholder="입력해주세요."
            onChange={(e) => setMemo(e.target.value)}
            rows={3}
            style={{
              width: '100%', background: 'transparent', border: 'none', outline: 'none',
              resize: 'none', fontFamily: "'Pretendard Variable', Pretendard, sans-serif", fontWeight: 400,
              fontSize: '22px', lineHeight: '155%', color: '#0D0D0D'
            }}
          />
        </div>

        {/* 하단 버튼 바 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginTop: '20px' }}>
          <button
            onClick={() => navigate('/patient-home')}
            style={{
              width: '121px', height: '59px', borderRadius: '50px', backgroundColor: '#0D0D0D',
              border: 'none', boxShadow: '0px 0px 4px 0px #4188ED',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'Pretendard Variable', Pretendard, sans-serif", fontWeight: 700, fontSize: '18px', color: '#FFFFFF', cursor: 'pointer'
            }}>
            그만하기
          </button>

          <button
            onClick={() => navigate('/patient-result')}
            style={{
              width: '151px', height: '59px', borderRadius: '50px', backgroundColor: '#4188ED',
              border: 'none', boxShadow: '0px 0px 4px 0px #4188ED',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'Pretendard Variable', Pretendard, sans-serif", fontWeight: 700, fontSize: '18px', color: '#FFFFFF', cursor: 'pointer'
            }}
          >
            활동 완료 →
          </button>
        </div>

      </main>
    </div>
  );
}