import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import NameCard, { type MBTI } from './NameCard';
import './App.css';

interface NameCardData {
  name: string;
  catname: string;
  group: string;
  mbti: MBTI;
}

export default function App() {
  const [nameCardData, setNameCardData] = useState<NameCardData[]>([]);
  const [showNameCards, setShowNameCards] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = e => {
      const data = e.target?.result;
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet) as Record<string, unknown>[];

      const formattedData: NameCardData[] = jsonData.map(row => ({
        name: String(row.name || ''),
        catname: String(row.catname || ''),
        group: String(row.group || ''),
        mbti: String(row.mbti || '') as MBTI,
      }));

      setNameCardData(formattedData);
    };
    reader.readAsArrayBuffer(file);
  };

  const generateNameCards = () => {
    if (nameCardData.length > 0) {
      setShowNameCards(true);
    } else {
      alert('먼저 엑셀 파일을 업로드해주세요.');
    }
  };

  const handlePrint = () => {
    if (showNameCards) {
      window.print();
    } else {
      alert('먼저 명찰을 생성해주세요.');
    }
  };

  return (
    <div className="app">
      <div className="controls no-print">
        <div className="file-upload-section">
          <h1>쑥고개성당 여름캠프 명찰 생성 웹 어플리케이션</h1>

          <p>
            name(이름), catname(세례명), group(조), mbti 컬럼이 있는 엑셀 파일을 아래 버튼을 눌러 첨부하고 명찰 생성
            버튼을 누르세요
          </p>
          <div className="upload-container">
            <label htmlFor="file-input" className="file-label">
              엑셀 파일 선택
            </label>
            <input id="file-input" type="file" accept=".xlsx,.xls" onChange={handleFileUpload} className="file-input" />
          </div>
          {nameCardData.length > 0 && (
            <p className="file-status">{nameCardData.length}개의 명찰 데이터가 로드되었습니다.</p>
          )}
        </div>

        <div className="button-section">
          <button onClick={generateNameCards} className="generate-btn" disabled={nameCardData.length === 0}>
            명찰 생성
          </button>
          <button onClick={handlePrint} className="print-btn" disabled={!showNameCards}>
            인쇄
          </button>
        </div>
      </div>

      {showNameCards && (
        <div className="name-cards-container">
          <div className="name-cards-grid">
            {nameCardData.map((data, index) => (
              <NameCard key={index} data={data} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
