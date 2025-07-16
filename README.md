# 2D 웹 MMORPG (레벨/경험치/인벤토리/채팅/몬스터AI/맵)

## 소개
- 2D 웹 기반 MMORPG 업그레이드 예제입니다.
- 한글 UI, PvE(몬스터 사냥), PvP(플레이어 대전), 레벨/경험치/스탯, 인벤토리, 채팅, 몬스터AI, 맵 등 다양한 기능을 포함합니다.
- React + Canvas(클라이언트), Node.js + Socket.io(서버)로 구성되어 있습니다.

## 폴더 구조
```
game/
  client/
    src/
      components/
        Map.js
        StatusBar.js
        Inventory.js
        Chat.js
      App.js
      index.js
    public/
      index.html
    package.json
  server/
    data/
    index.js
    package.json
  README.md
```

## 실행 방법

### 1. 서버 실행
```
cd server
npm install
node index.js
```

### 2. 클라이언트 실행
```
cd client
npm install
npm start
```

- 클라이언트: http://localhost:3000
- 서버: http://localhost:3001

## 주요 기능
- 실시간 접속/이동/공격 동기화
- 몬스터(PvE), 플레이어(PvP) 공격
- 레벨/경험치/스탯/HP/MP/공격력
- 몬스터 AI(이동/공격/리스폰)
- 아이템 드랍/인벤토리/사용
- 실시간 채팅
- 2D 타일 맵(벽/장애물/이동 제한)
- 한글 닉네임/채팅

---

추가 기능(퀘스트, 상점, 파티 등)은 자유롭게 확장 가능합니다. 