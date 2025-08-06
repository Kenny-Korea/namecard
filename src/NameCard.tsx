import { mbtiDescription } from './data/mbti';

export type MBTI =
  | 'INTJ'
  | 'INTP'
  | 'ENTJ'
  | 'ENTP'
  | 'INFJ'
  | 'INFP'
  | 'ENFJ'
  | 'ENFP'
  | 'ISTJ'
  | 'ISTP'
  | 'ISFJ'
  | 'ISFP'
  | 'ESTJ'
  | 'ESTP'
  | 'ESFJ'
  | 'ESFP';

interface NameCardData {
  name: string;
  catname: string;
  group: string;
  mbti: MBTI;
}

interface NameCardProps {
  data: NameCardData;
}

export default function NameCard(props: NameCardProps) {
  const { data } = props;

  const getCharacterImage = (group: string) => {
    const groupNumber = group.replace('조', ''); // '1조' -> '1'
    return `./images/character/character${groupNumber}.png`;
  };

  const getMbtiColor = (mbti: MBTI) => {
    const prefix = mbti.substring(0, 2);
    switch (prefix) {
      case 'IS':
        return '#16a34a'; // 초록색 (차분하고 안정적인 느낌)
      case 'IN':
        return '#8b5cf6'; // 보라색 (직관적이고 창의적인 느낌)
      case 'ES':
        return '#1187cf'; // 주황색 (활발하고 에너지 넘치는 느낌)
      case 'EN':
        return '#ef4444'; // 빨간색 (열정적이고 외향적인 느낌)
      default:
        return '#1187cf'; // 기본 파란색
    }
  };

  return (
    <div
      className="name-card"
      style={{
        backgroundImage: 'url(./images/background/background.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="relative w-full h-full px-4 py-8">
        <img src={getCharacterImage(data.group)} alt="character" className="absolute top-0 -right-2 w-20 h-20" />
        <div className="w-full h-full flex flex-col bg-[#EEEEEE]/50 rounded-2xl">
          <div className="w-full h-full flex flex-col justify-center items-center gap-8">
            <div className="w-full flex justify-end mr-12">
              <p className="text-5xl">{data.group}</p>
            </div>
            <div className="flex flex-col gap-6 items-center">
              <p className="text-7xl">{data.name}</p>
              <p className="text-5xl break-keep text-center" style={{ fontSize: '2.7rem' }}>
                {data.catname}
              </p>
              <div className="flex flex-col items-center justify-center" style={{ color: getMbtiColor(data.mbti) }}>
                <p className="text-5xl font-[900]">{data.mbti.toUpperCase()}</p>
                <p className="text-3xl">{mbtiDescription[data.mbti]}</p>
              </div>
            </div>
            <div className="flex flex-col text-xl justify-center items-center">
              <p>2025 청년 여름캠프</p>
              <p>천주교 서울대교구 쑥고개성당</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
