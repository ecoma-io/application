# Tài liệu Hệ thống Ecoma

Chào mừng bạn đến với tài liệu chính thức của Ecoma — Nền tảng SaaS quản trị vận hành cho các doanh nghiệp điện tử toàn diện.

Tài liệu này là nguồn thông tin toàn diện về hệ thống, từ nghiệp vụ cốt lõi đến kiến trúc kỹ thuật và cách triển khai. Nó được thiết kế như một tài nguyên sống, đồng hành cùng sự phát triển của Ecoma, hỗ trợ đội ngũ kỹ thuật, chuyên gia nghiệp vụ, QA và các bên liên quan khác hiểu, xây dựng và vận hành hệ thống hiệu quả.

## 1. Tầm nhìn, sứ mệnh, giá trị cốt lõi và khách hàng mục tiêu

**Tầm nhìn (Vision)**: Trở thành nền tảng số hóa vận hành toàn diện nhất bao phủ hết tất cả các khía cạnh của một doanh nghiệp, trao quyền cho mọi doanh nghiệp điện tử vươn tới hiệu quả tối ưu và tăng trưởng bền vững trong kỷ nguyên số.

**Sứ mệnh (Mission)**: Cung cấp một nền tảng SaaS quản trị vận hành mạnh mẽ và linh hoạt và toàn diện giúp các doanh nghiệp điện tử hợp nhất dữ liệu, tự động hóa quy trình, tối ưu hiệu quả hoạt động, nâng cao năng lực ra quyết định từ đó vượt qua thách thức và kiến tạo thành công.

**Giá trị cốt lõi (Core Values)**:

- **Quản trị dữ liệu tập trung và hợp nhất:** Giúp doanh nghiệp tích hợp và có cái nhìn toàn diện về dữ liệu từ các phòng ban khác nhau.
- **Tự động hóa và tối ưu hóa quy trình:** Chuyển đổi các quy trình thủ công thành quy trình tự động, hiệu quả và dễ kiểm soát, giảm thiểu sai sót.
- **Nâng cao năng lực ra quyết định dựa trên dữ liệu:** Cung cấp khả năng theo dõi hiệu suất theo thời gian thực và báo cáo chính xác để hỗ trợ ra quyết định chiến lược.
- **Đơn giản hóa quản lý đa kênh:** Tích hợp và quản lý hiệu quả hoạt động trên nhiều kênh bán hàng khác nhau từ một nền tảng duy nhất.
- **Tăng cường tính nhất quán trải nghiệm khách hàng:** Đảm bảo trải nghiệm liền mạch và đồng nhất cho khách hàng trên mọi điểm chạm.
- **Hỗ trợ tăng trưởng và mở rộng quy mô bền vững:** Cho phép doanh nghiệp dễ dàng mở rộng hoạt động, thêm kênh bán hàng mới và hỗ trợ các thị trường/khu vực khác nhau.

**Khách hàng mục tiêu của Ecoma**

- Doanh nghiệp cần mở rộng kênh bán hàng.
- Doanh nghiệp cần số hóa quy trình để tối ưu vận hành.
- Các đơn vị đang và sẽ kinh doanh online.

## 2. Mục tiêu thiết kế hệ thống

Hệ thống ecoma được thiết kế để đạt được các 7 mục tiêu kỹ thuật và vận hành cụ thể sau:

1. **Tính sẵn sàng cao (High Availability):** Đảm bảo uptime tối đa trong môi trường production thông qua kiến trúc phân tán và khả năng phục hồi tự động.
2. **Khả năng chịu lỗi (Fault Tolerance):** Cô lập lỗi ở cấp độ từng service hoặc module, đảm bảo sự cố tại một thành phần không làm sập toàn bộ hệ thống.
3. **Dễ dàng mở rộng/thu hẹp quy mô phục vụ (Scalability):** Hỗ trợ mở rộng theo chiều ngang (horizontal scaling) và có khả năng auto-scaling linh hoạt dựa trên tải.
4. **Dễ dàng bảo trì và cách ly lỗi (Maintainability & Isolation):** Mỗi service/module có trách nhiệm rõ ràng, độc lập về dữ liệu và logic, giúp việc cập nhật, sửa lỗi và thay thế trở nên đơn giản, không ảnh hưởng diện rộng.
5. **Developer Experience tốt (DX):** Cung cấp môi trường làm việc hiệu quả, nhất quán với code rõ ràng, dễ test, công cụ hiện đại và quy trình phát triển tự động.
6. **Hướng tới phát triển sản phẩm lâu dài (Product-oriented):** Kiến trúc và thiết kế hệ thống dễ dàng tiếp nhận các tính năng mới, module nghiệp vụ mới một cách nhanh chóng và có khả năng mở rộng theo hướng sản phẩm.
7. **Bảo mật từ thiết kế (Security by Design):** Các biện pháp bảo mật được tích hợp ngay từ giai đoạn thiết kế, áp dụng ở nhiều lớp khác nhau để giảm thiểu rủi ro.
8. **Quản lý thông tin liên lạc rõ ràng (Contract-first Communication):** Định nghĩa rõ ràng "hợp đồng" giao tiếp giữa các thành phần (API, message schema) để đảm bảo tính tương thích và dễ dàng tích hợp.
9. **Giảm chi phí vận hành và phát triển (Operational Efficiency & Development):** Tối ưu hóa việc sử dụng hạ tầng, tự động hóa quy trình triển khai, giảm thời gian onboarding nhân sự mới và tăng tốc độ phát triển tính năng.

## 3. Nguyên tắc cốt lõi

Chúng tôi xây dựng Ecoma không chỉ như một hệ thống phần mềm, mà là một nền tảng định hình lại cách doanh nghiệp vận hành, ra quyết định và phát triển trong môi trường số. Kim chỉ nam cho mọi quyết định thiết kế, phát triển và triển khai hệ thống là 6 nguyên tắc cốt lõi sau đây:

1. **Tập trung vào giá trị kinh doanh:** Mọi tính năng, cải tiến và quyết định thiết kế đều phải phục vụ mục tiêu tối ưu hiệu quả vận hành và gia tăng giá trị kinh doanh cho khách hàng. Không theo đuổi công nghệ vì công nghệ, mà vì khả năng giải quyết vấn đề thực tế. Ưu tiên giải pháp đơn giản, dễ vận hành, dễ hiểu với người dùng cuối.
2. **Thiết kế để mở rộng:** Ecoma được thiết kế với tầm nhìn dài hạn, có khả năng mở rộng cả về mặt chức năng lẫn quy mô sử dụng. Áp dụng kiến trúc microservices, DDD và CQRS để hỗ trợ phát triển song song, phân tách trách nhiệm và scale linh hoạt. Khả năng cấu hình và tùy biến để phù hợp với nhiều loại hình doanh nghiệp và ngành nghề.
3. **Dữ liệu là trung tâm:** Mọi quyết định vận hành trong doanh nghiệp đều cần dữ liệu chính xác, cập nhật và có ngữ cảnh. Thiết kế hệ thống theo hướng data-first, hỗ trợ báo cáo theo thời gian thực và khả năng truy vấn theo ngữ cảnh nghiệp vụ. Cấu trúc dữ liệu phản ánh mô hình nghiệp vụ thực tế, đảm bảo tính chính xác và khả năng mở rộng.
4. **Tự động hóa thông minh:** Loại bỏ thao tác thủ công, giảm thiểu sai sót và giải phóng nguồn lực để tập trung vào các hoạt động tạo giá trị. Hệ thống hỗ trợ tự động hóa quy trình nghiệp vụ có thể cấu hình.
5. **Trải nghiệm người dùng là cốt lõi:** Một hệ thống mạnh mẽ nhưng khó dùng là một hệ thống thất bại. Giao diện hiện đại, tối ưu cho cả desktop và thiết bị di động. Luồng thao tác được thiết kế phù hợp với ngữ cảnh sử dụng thực tế, giảm thời gian học và thao tác.
6. **An toàn và tin cậy theo mặc định:** Ecoma đặt yếu tố bảo mật, tuân thủ và ổn định làm nền tảng trong mọi thành phần. Thiết kế secure-by-default, kiểm soát truy cập theo vai trò, mã hóa dữ liệu quan trọng. Hệ thống được giám sát liên tục, có khả năng phục hồi và mở rộng vùng hoạt động.

## 4. Nguyên lý thiết kế

Để hiện thực hóa các cách tiếp cận kiến trúc và đạt được các mục tiêu hệ thống, chúng tôi tuân thủ các nguyên lý thiết kế chi tiết sau đây:

### 4.1. Thiết kế Service & Domain

- **Single Responsibility:** Mỗi service hoặc module nghiệp vụ phải có một trách nhiệm rõ ràng và duy nhất, dựa trên phân rã Bounded Contexts từ DDD. Điều này giúp tăng khả năng bảo trì, dễ test và phát triển độc lập.
- **Self-contained Systems (SCS):** Các service hướng tới khả năng tự quản lý logic, dữ liệu và các phụ thuộc cần thiết. Giảm thiểu sự phụ thuộc chéo, tăng tính độc lập khi triển khai và vận hành.
- **Versioned Service:** API và contract của mỗi service phải hỗ trợ versioning để đảm bảo backward compatibility, cho phép các thành phần khác nhau (service khác, client app) có thể cập nhật độc lập theo thời gian.

### 4.2. Giao tiếp & Tích hợp

- **Loose Coupling:** Các thành phần của hệ thống được thiết kế để có sự phụ thuộc thấp nhất có thể. Giao tiếp chính giữa các service thông qua Message Broker (Async) hoặc API Gateway (Sync HTTP). Mỗi service quản lý cơ sở dữ liệu riêng, tránh phụ thuộc dữ liệu trực tiếp.
- **Async by Default:** Giao tiếp **giữa các service backend** được ưu tiên thực hiện theo cơ chế bất đồng bộ thông qua Message Broker. Điều này giúp hệ thống phản ứng nhanh hơn, chịu được tải cao và dễ dàng mở rộng theo mô hình EDA. Giao tiếp từ Client đến backend là đồng bộ (HTTP/API Gateway).
- **Contract-first Communication:** Các "hợp đồng" giao tiếp (API endpoints, message payloads) được định nghĩa rõ ràng và tường minh ngay từ đầu bằng các chuẩn như OpenAPI (cho API) và JSON Schema (cho message). Các định nghĩa này được quản lý phiên bản và là cơ sở để kiểm tra tính tương thích tự động trong CI/CD.

### 4.3. Vận hành & Hạ tầng

- **Auto Scaling & Isolation:** Kiến trúc Microservices và việc sử dụng CQRS (nơi cần thiết) cho phép scale độc lập từng thành phần theo chiều ngang. Tài nguyên được cô lập để tránh hiệu ứng "hàng xóm ồn ào".
- **Infrastructure as Code (IaC):** Toàn bộ hạ tầng và cấu hình triển khai được định nghĩa bằng code và quản lý qua các công cụ như Helm, ArgoCD. Điều này đảm bảo tính nhất quán, khả năng tái tạo môi trường, rollback và dễ dàng quản lý phiên bản hạ tầng.
- **Bảo mật đa tầng tại các điểm kiểm soát:** Các lớp bảo mật được áp dụng tại nhiều điểm trong hệ thống: biên mạng, API Gateway (xác thực, ủy quyền), kết nối giữa các service, truy cập cơ sở dữ liệu. Áp dụng nguyên tắc đặc quyền tối thiểu (least privilege) và kiểm soát truy cập dựa trên vai trò (RBAC).

### 5.4. Trải nghiệm Nhà phát triển (Developer Experience)

- **Testable Architecture:** Cấu trúc code bên trong mỗi service tuân thủ các nguyên tắc của Clean Architecture, tách biệt rõ ràng logic nghiệp vụ khỏi các chi tiết kỹ thuật (database, external services, UI), giúp dễ dàng viết Unit Test và Integration Test. Sử dụng các kỹ thuật như Dependency Injection và mocking.
- **Modular & Extensible:** Hệ thống được xây dựng từ các module độc lập, dễ dàng thêm mới hoặc mở rộng tính năng mà không gây ảnh hưởng lớn đến các phần hiện có. Sử dụng monorepo với các công cụ quản lý dependency nội bộ (như Nx) để quản lý mối quan hệ giữa các module/service.
- **Tooling & Automation:** Tích hợp chặt chẽ các công cụ và quy trình tự động hóa trong chu trình phát triển: CI/CD (GitHub Actions, ArgoCD), tự động triển khai, Git hooks, static analysis (linters), code formatting (ESLint, Prettier), scaffolding, và môi trường phát triển tiêu chuẩn hóa (devcontainer).

### 4.5. Triết lý Hướng Sản phẩm

- **Product-aligned Architecture:** Việc phân rã service và module được định hình bởi ngữ nghĩa và luồng nghiệp vụ của sản phẩm, thay vì chỉ dựa trên các tiêu chí kỹ thuật đơn thuần. Mục tiêu là kiến trúc hỗ trợ tốt nhất cho sự phát triển và tối ưu hóa các tính năng hướng tới người dùng cuối.
- **Strategic Stack Unification:** Lựa chọn và sử dụng chung một tập hợp công nghệ cốt lõi cho toàn bộ hệ thống (ví dụ: NestJS, NATS, RabbitMQ, MongoDB, Postgresql, Redis, Typescript, Nx Monorepo, Devcontainer, Playwright, Jest). Điều này giúp tối ưu hóa nguồn lực đội ngũ, giảm chi phí đào tạo, tăng khả năng hỗ trợ chéo giữa các team và duy trì sự nhất quán.

## 5. Mối liên hệ giữa Nguyên lý và Mục tiêu

Các nguyên lý thiết kế chi tiết (Mục 5) không tồn tại độc lập mà được lựa chọn và áp dụng một cách có chủ đích để đạt được các mục tiêu hệ thống đã đề ra (Mục 3). Bảng dưới đây minh họa mối liên hệ chính:

| Nguyên lý Thiết kế Chi tiết                                   | Mục tiêu Hệ thống Đạt được                                                                        |
| :------------------------------------------------------------ | :------------------------------------------------------------------------------------------------ |
| **Single Responsibility, SCS, Versioned Service**             | Dễ dàng bảo trì và cách ly lỗi, Hướng tới phát triển sản phẩm lâu dài                             |
| **Loose Coupling, Async by Default (EDA), Contract-first**    | Tính sẵn sàng cao, Khả năng chịu lỗi, Dễ dàng mở rộng, Quản lý thông tin liên lạc rõ ràng         |
| **Auto Scaling & Isolation, IaC, Bảo mật đa tầng**            | Tính sẵn sàng cao, Khả năng chịu lỗi, Dễ dàng mở rộng, Bảo mật từ thiết kế, Giảm chi phí vận hành |
| **Testable Architecture, Modular & Extensible, Tooling**      | Developer Experience tốt, Dễ dàng bảo trì, Giảm chi phí phát triển                                |
| **Product-aligned Architecture, Strategic Stack Unification** | Hướng tới phát triển sản phẩm lâu dài, Giảm chi phí vận hành và phát triển                        |

Việc áp dụng nhất quán các nguyên lý này là chìa khóa để xây dựng một hệ thống Ecoma mạnh mẽ, linh hoạt và có khả năng phát triển lâu dài, đồng thời hiện thực hóa các nguyên tắc cốt lõi đã đề ra.

Bạn có thể sử dụng tài liệu này như một kim chỉ nam để:

- Hiểu rõ mục đích và tầm nhìn của hệ thống Ecoma.
- Nắm vững các nguyên tắc và cách tiếp cận thiết kế cốt lõi.
- Tìm hiểu chi tiết về các miền nghiệp vụ và mô hình dữ liệu.
- Hiểu cách các thành phần kỹ thuật tương tác với nhau.
- Tham khảo các quyết định thiết kế quan trọng.

## 6. Cách tiếp cận thiết kế và kiến trúc

Với đặc thù nghiệp vụ cực kì phức tạp và yêu cầu biến đổi một cách linh hoạt để phục vụ đa loại hình đa cách thức vận hành doanh nghiệp. Ở Ecoma chúng tôi sử dụng các thiết kế và kiến trúc đã được chứng minh phù hợp với các mục tiêu và nguyên tắc thiết kế của hệ thống.

Ecoma ứng dụng phương pháp thiết kế **[Domain-Driven Design](/explain-decisions/ddd)** làm phương pháp thiết kế cốt lõi. Đồng thời kết hợp chặt chẽ với các kiến trúc **[Microservices Architecture](/explain-decisions/ma)**, **[Event-Driven Architecture](/explain-decisions/eda)**, **[Clean Architecture](/explain-decisions/ca)** tạo thành 1 tập hợp kiến trúc mạnh mẽ đã dược chứng minh đáp ứng hoàn toàn các mục tiêu và phù hợp với các nguyên lý thiết kế của hệ thống đã đề ra ở trên.

Ngoài ra các mẫu thiết kế **CQRS (Command Query Responsibility Segregation)**, **Repository Pattern**, **Domain Events**, **Saga Pattern** cũng được áp dụng khiến cho việc triển khai hệ thống trở nên nhất quán và dễ dàng nắm bắt từ phần này sang phần khác của hệ thống

Với các tiếp cận này giúp cho hệ thống không cần phải phát minh lại "bánh xe" và dễ dàng đạt được đạt được sự mô-đun hóa, khả năng mở rộng, dễ bảo trì và bám sát nghiệp vụ, giúp tiết kiệm chi phí vận hành hệ thống có thể sẽ đem lại lợi thế cạnh tranh, tiết kiệm thời gian on boarding nhân sự...
