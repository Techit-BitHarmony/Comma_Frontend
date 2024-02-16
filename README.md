# COM,MA

### 인디 작곡가를 위한 음악 플랫폼
- 인디 작곡가를 위한 음악 플랫폼은 창작자들에게 피드백과 정보, 후원 기회를 제공하여 창작 활동을 지원합니다!

- [COM,MA 이용해보기!](https://compose-market.vercel.app/)

![main](https://github.com/Techit-BitHarmony/Comma_Frontend/assets/51808344/0b9d3a70-15cc-452c-810b-bb11aad7b4ff)

### 백엔드 작업물로 이동
- 자세한 내용은 백엔드 Repository에서 확인 가능합니다!
- [Comma BackEnd](https://github.com/Techit-BitHarmony/Comma)

### 기술적 의사결정
    1. Album (유민)
        1. ncp object storage, ncp global edge : → ncp 에 대한 설명, ncp 홈페이지 설명 참고 ~~한 장점이 있다.
        2. ncp image optimizer : 프론트에서도 가능하지만 **ncp의 기능을 활용**하면서 crop을 하고 이미지의 최적화를 하고 싶었습니다. ncp에서 변환유형을 설정하여 이미지 변환 환경을 **직접 코드를 작성하는 것보다 쉽게 설정할 수 있었습니다**.
    2. Streaming (동국)
        1. ncp vod station : **ncp object storage와의 연계**, **Encoding 된 파일을 Channel을 통해CDN 링크로 제공**함으로써 음원 스트리밍을 수월하게 진행할 수 있다는 장점이 있어 선택하게 되었습니다.
        2. ncp cloud functions : **ncp object storage와 ncp vod station을 연결**할 수 있게 해주며 부가적인 기능 (**인코딩 상태를 callback)을 제공**할 수 있어 선택하게 되었습니다.
        3. redis pub/sub : server에서 client 측으로 데이터를 전송하는 방법에는 여러가지가 있다. (web socket, sse, long polling, short polling) 서버 측에서 발생하는 이벤트를 클라이언트에 전달해야하는 상황에서 선택할 수 있는 요소는 web socket과 SSE가 있었다. web socket은 지속적인 연결을 통해 양방향으로 데이터를 전송할 수 있으나 구현이 어려우며, 연결 비용이 SSE 보다 상대적으로 높은 문제가 있었습니다.
        그렇기에 서버에서 클라이언트 측으로만 데이터를 전달할 수 있는 **sse 방식이 가장 적절하다고 생각하였고, 이를 채용하게 되면서 이를 구현**하기에 알맞은 기능인 redis의 publish / subscribe 기능을 사용하게 되었습니다.
    3. credit (상혁)
        1. TossPayments : 크레딧 충전 기능을 구현하기 위해 다양한 결제 수단을 제공하는 결제 시스템이 필요함. PortOne과 TossPayments를 많이 사용하지만 PortOne은 결제 검증을 결제 승인 후 진행하는 반면 TossPayments는 결제 승인 전 검증하여 유효하지 않은 경우 결제 승인을 하지 않아 연동 및 테스트가 편할 것으로 예상하여 TossPayments를 선택함. 또한 PortOne은 PortOne 서버를 한번 더 거치므로 해당 서버에러에 대응하기 어려운 점도 선택할 때 고려하였다. 
    4. donation (용욱)
        1. quartz scheduler : 정기후원 기능을 구현하기 위해 주기적으로 실행되는 프로세스를 관리하는 기능이 필요했다. 이를 위한 방법으로 스프링 스케줄러와 quartz가 후보에 있었다. 그러나 정기후원의 날짜와 금액을 변경하는 기능이 필요한 상황에서 **스프링 스케줄러는 동적인 작업변경을 지원하지 않는다**. 따라서 스프링 스케줄러는 작업을 등록한 이후 변경할 필요가 없는 정적인 작업에 적합하기 때문에 , **동적으로 작업을 변경하는 기능을 제공하는 quartz 스케줄러가 적합**하다고 판단했다.
    5. member (창현)
        - redis : 빈번히 조회되는 데이터를 직접 데이터베이스에 저장하고 조회하는 것보다 In-memory인 redis를 사용함으로써 DB 성능과 안정성 향상에 도움을 줌.
