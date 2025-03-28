# NGE UI

## Giới thiệu

NGE UI là thư viện UI components của Ecoma, được xây dựng trên nền tảng Angular. Thư viện này cung cấp một bộ components, directives, và services được thiết kế đồng bộ và tuân thủ design system của Ecoma, giúp các ứng dụng trong hệ sinh thái có giao diện nhất quán và chuyên nghiệp.

## Các thành phần chính

### Components

- **Buttons**: Button, IconButton, ButtonGroup, ToggleButton
- **Forms**: Input, Textarea, Select, Checkbox, Radio, Switch, DatePicker
- **Layout**: Card, Panel, Grid, Divider, Spacer
- **Navigation**: Menu, Tabs, Breadcrumb, Pagination, Stepper
- **Feedback**: Alert, Dialog, Modal, Toast, Progress, Spinner
- **Data Display**: Table, List, Avatar, Badge, Tag, Tooltip
- **Charts**: LineChart, BarChart, PieChart, DonutChart
- **Advanced**: DataGrid, FileUpload, RichTextEditor, Calendar

### Directives

- **Tooltip**: Hiển thị tooltip khi hover
- **Ripple**: Hiệu ứng ripple khi click
- **Resize**: Theo dõi thay đổi kích thước element
- **Intersection**: Theo dõi element có nằm trong viewport không
- **Drag & Drop**: Hỗ trợ kéo thả các element

### Services

- **ThemeService**: Quản lý theme (light/dark)
- **NotificationService**: Hiển thị thông báo
- **DialogService**: Hiển thị dialog
- **LoadingService**: Quản lý trạng thái loading

## Cài đặt

```bash
# Trong monorepo Ecoma
nx build nge-ui
```

## Sử dụng

### Import module

```typescript
import { NgeUiModule } from "@ecoma/nge-ui";

@NgModule({
  imports: [NgeUiModule],
  // ...
})
export class AppModule {}
```

### Sử dụng components

```html
<nge-button variant="primary" size="medium">Click me</nge-button>

<nge-input label="Username" placeholder="Enter your username" [required]="true"> </nge-input>

<nge-table [data]="users" [columns]="columns" [pagination]="true"> </nge-table>
```

## Theming

Thư viện hỗ trợ tùy chỉnh theme thông qua CSS variables:

```scss
:root {
  --nge-primary-color: #3f51b5;
  --nge-secondary-color: #f50057;
  --nge-background-color: #ffffff;
  --nge-text-color: #333333;
  --nge-border-radius: 4px;
  // ...
}

.dark-theme {
  --nge-background-color: #121212;
  --nge-text-color: #ffffff;
  // ...
}
```

## Accessibility

Tất cả các components đều được thiết kế để tuân thủ các tiêu chuẩn WCAG 2.1 AA:

- Keyboard navigation
- ARIA attributes
- Proper contrast ratios
- Focus management

## Browser Support

- Chrome (2 phiên bản mới nhất)
- Firefox (2 phiên bản mới nhất)
- Edge (2 phiên bản mới nhất)
- Safari (2 phiên bản mới nhất)

## Development

### Cấu trúc thư mục

```
nge-ui/
├── src/
│   ├── lib/
│   │   ├── components/         # UI components
│   │   ├── directives/         # Angular directives
│   │   ├── services/           # Angular services
│   │   ├── pipes/              # Angular pipes
│   │   ├── models/             # TypeScript interfaces/types
│   │   └── utils/              # Utility functions
│   ├── styles/                 # Global styles
│   └── index.ts                # Public API
├── stories/                    # Storybook stories
└── testing/                    # Testing utilities
```

### Chạy Storybook

```bash
nx run nge-ui:storybook
```

### Chạy tests

```bash
nx test nge-ui
```

## Đóng góp

Khi phát triển components mới, cần tuân thủ các nguyên tắc sau:

1. Mỗi component phải có tài liệu đầy đủ và stories trong Storybook
2. Mỗi component phải có unit tests với độ bao phủ tối thiểu 80%
3. Mỗi component phải hỗ trợ accessibility và keyboard navigation
4. Mỗi component phải responsive và hoạt động tốt trên mobile
5. Mỗi component phải hỗ trợ theme light/dark
6. Mỗi component phải có API rõ ràng và dễ sử dụng

## Versioning

Thư viện tuân theo [Semantic Versioning](https://semver.org/).

## License

Copyright © 2024 Ecoma. All rights reserved.
