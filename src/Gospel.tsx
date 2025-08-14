import React, { useState } from 'react';
import * as XLSX from 'xlsx';

interface GospelData {
  verse: string;
  description: string;
  first: string;
  second: string;
}

interface GospelCardProps {
  verse: string;
  text: string;
  type: 'first' | 'second';
  number: number;
}

function GospelCard({ verse, text, type, number }: GospelCardProps) {
  if (type === 'first') {
    // 왼쪽 열: 좌상단에 번호, verse 제거
    return (
      <div
        className="gospel-card w-full h-full px-4 py-2 bg-cover bg-center bg-no-repeat box-border relative"
        style={{
          backgroundImage: 'url(./images/background/gospel1.png)',
        }}
      >
        <div className="bg-white/70 p-2 rounded-lg w-full h-full relative flex flex-col justify-center items-center text-center">
          {/* 좌상단 번호 */}
          <div className="absolute top-2 left-2 text-xs font-bold text-gray-700">{number}.</div>
          {/* 중앙 텍스트 */}
          <div
            className="text-sm leading-tight text-center whitespace-pre-wrap"
            style={{ wordBreak: 'keep-all', overflowWrap: 'break-word' }}
          >
            {text}
          </div>
        </div>
      </div>
    );
  } else {
    // 오른쪽 열: 우하단에 verse
    return (
      <div
        className="gospel-card w-full h-full px-4 py-2 bg-cover bg-center bg-no-repeat box-border relative"
        style={{
          backgroundImage: 'url(./images/background/gospel2.png)',
        }}
      >
        <div className="bg-white/70 p-2 rounded-lg w-full h-full relative flex flex-col justify-center items-center text-center">
          {/* 중앙 텍스트 */}
          <div
            className="text-sm leading-tight text-center whitespace-pre-wrap"
            style={{ wordBreak: 'keep-all', overflowWrap: 'break-word' }}
          >
            {text}
          </div>
          {/* 우하단 verse */}
          <div className="absolute bottom-2 right-2 text-xs font-bold text-gray-600">{verse}</div>
        </div>
      </div>
    );
  }
}

export default function Gospel() {
  const [gospelData, setGospelData] = useState<GospelData[]>([]);
  const [showGospelCards, setShowGospelCards] = useState(false);

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

      const formattedData: GospelData[] = jsonData.map(row => ({
        verse: String(row.verse || ''),
        description: String(row.description || ''),
        first: String(row.first || ''),
        second: String(row.second || ''),
      }));

      setGospelData(formattedData);
    };
    reader.readAsArrayBuffer(file);
  };

  const generateGospelCards = () => {
    if (gospelData.length > 0) {
      setShowGospelCards(true);
    } else {
      alert('먼저 엑셀 파일을 업로드해주세요.');
    }
  };

  const handlePrint = () => {
    if (showGospelCards) {
      window.print();
    } else {
      alert('먼저 성경 구절 카드를 생성해주세요.');
    }
  };

  // 2x9 그리드로 데이터 재배열 (2열 9행으로 총 18개)
  const arrangeCardsInGrid = () => {
    const cards: React.ReactElement[] = [];
    const totalPages = Math.ceil(gospelData.length / 9); // 9개씩 한 페이지 (2열 9행)

    for (let page = 0; page < totalPages; page++) {
      const pageData = gospelData.slice(page * 9, (page + 1) * 9);

      cards.push(
        <div
          key={`page-${page}`}
          className="gospel-page w-[210mm] h-[297mm] p-[5mm] box-border grid grid-rows-9 grid-cols-2 gap-[2mm]"
          style={{
            pageBreakAfter: page < totalPages - 1 ? 'always' : 'auto',
          }}
        >
          {/* 각 행마다 왼쪽에 first, 오른쪽에 second */}
          {pageData.map((data, index) => (
            <React.Fragment key={`row-${page}-${index}`}>
              <GospelCard verse={data.verse} text={data.first} type="first" number={page * 9 + index + 1} />
              <GospelCard verse={data.verse} text={data.second} type="second" number={page * 9 + index + 1} />
            </React.Fragment>
          ))}
        </div>
      );
    }

    return cards;
  };

  return (
    <div className="gospel-section">
      <div className="controls no-print mb-5 p-5 border border-gray-300 rounded-lg">
        <h2>성경 구절 출력 웹 어플리케이션</h2>
        <p>verse, description, first, second 컬럼이 있는 엑셀 파일을 업로드하세요.</p>
        <p>A4 용지에 2열 9행 그리드로 총 18개의 성경 구절이 출력됩니다.</p>

        <div className="mb-2.5">
          <label
            htmlFor="gospel-file-input"
            className="inline-block py-2.5 px-5 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700"
          >
            성경 구절 엑셀 파일 선택
          </label>
          <input
            id="gospel-file-input"
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>

        {gospelData.length > 0 && (
          <p className="text-green-600 mb-2.5">{gospelData.length}개의 성경 구절 데이터가 로드되었습니다.</p>
        )}

        <div className="flex gap-2.5">
          <button
            onClick={generateGospelCards}
            disabled={gospelData.length === 0}
            className={`py-2.5 px-5 text-white border-none rounded ${
              gospelData.length === 0
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-600 cursor-pointer hover:bg-green-700'
            }`}
          >
            성경 구절 카드 생성
          </button>
          <button
            onClick={handlePrint}
            disabled={!showGospelCards}
            className={`py-2.5 px-5 text-white border-none rounded ${
              !showGospelCards ? 'bg-gray-400 cursor-not-allowed' : 'bg-cyan-600 cursor-pointer hover:bg-cyan-700'
            }`}
          >
            인쇄
          </button>
        </div>
      </div>

      {showGospelCards && <div className="gospel-cards-container">{arrangeCardsInGrid()}</div>}
    </div>
  );
}
