const d3 = require('d3');
const tape = require('tape');
const jelly = require('../dist/jelly.node');
//require('http://apis.daum.net/maps/maps3.js?apikey=7fd8127881fe4e612aabd7d3aca98636&libraries=services')
var latLngPoints = []
for (var i = 0; i < 20; i++ ) {
  latLngPoints.push({lat: 36.5 + (Math.random()-0.5) * 0.5, lng: 128 + (Math.random()-0.5) * 0.5, key : (i+1), value : Math.random()*100});
}
    
var addrPoints = [
  {"name":'개포1동주민센터', 'addr':'서울특별시 마포구 성암로 330번 711호', 'size':90},
  {"name":'개포2동주민센터', 'addr':'서울특별시 강남구 개포로 511', 'size':90},
  {"name":'개포4동주민센터', 'addr':'서울특별시 강남구 개포로38길 12', 'size':10},
  {"name":'논현1동주민센터', 'addr':'서울특별시 강남구 학동로20길 25', 'size':10},
  {"name":'논현2동주민센터', 'addr':'서울특별시 강남구 학동로43길 17', 'size':20},
  {"name":'대치1동주민센터', 'addr':'서울특별시 강남구 남부순환로391길 19', 'size':45},
  {"name":'대치2동주민센터', 'addr':'서울특별시 강남구 영동대로65길 24', 'size':85},
  {"name":'대치4동주민센터', 'addr':'서울특별시 강남구 도곡로77길 23', 'size':35},
  {"name":'도곡1동주민센터', 'addr':'서울특별시 강남구 도곡로18길 7', 'size':68},
  {"name":'도곡2동주민센터', 'addr':'서울특별시 강남구 남부순환로378길 34-9', 'size':72},
  {"name":'삼성1동주민센터', 'addr':'서울특별시 강남구 봉은사로 616', 'size':53},
  {"name":'삼성2동주민센터', 'addr':'서울특별시 강남구 봉은사로  419', 'size':68},
  {"name":'세곡동주민센터', 'addr':'서울특별시 강남구 밤고개로 286', 'size':35},
  {"name":'수서동주민세터', 'addr':'서울특별시 강남구 광평로 301-4', 'size':24},
  {"name":'신사동주민센터', 'addr':'서울특별시 강남구 압구정로 128', 'size':89},
  {"name":'압구정동주민센터', 'addr':'서울특별시 강남구 압구정로33길 48', 'size':48},
  {"name":'역삼1동주민센터', 'addr':'서울특별시 강남구 역삼로7길 16', 'size':38},
  {"name":'역삼2동주민센터', 'addr':'서울특별시 강남구 도곡로43길 25', 'size':20},
  {"name":'일원1동주민센터', 'addr':'서울특별시 강남구 양재대로55길 14', 'size':10},
  {"name":'일원2동주민센터', 'addr':'서울특별시 강남구 개포로  607', 'size':10}
];

tape('jelly-chart addr marker-map', function(test) {
  const container = 'jelly-test-container';
  d3.select('body').append('div').attr('id', container);
  var normal= jelly.markerMap()
    .container(`#${container}`)
    .data(addrPoints)
    .addr(true)
    .dimensions(['name']) // 주소의 키 (없어도 됨) //
    .measures(['addr']); // 첫번째는 주소, 다음은 크기
  normal.render();
  let count = 0;
  try {
    normal.on('loading', function() {
      count++;
    })
    normal.on('end', function() {
      test.test('addr marker-map should translate 20 addrs', function(test) {
        test.equal(count, 20);
        test.end();
      })
      test.end();
    })
  } catch (e) {
    test.end();
  }
  
});
