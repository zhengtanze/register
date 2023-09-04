import { ConfigProvider } from 'antd';
import 'antd/dist/antd.css';
import zhCN from 'antd/es/locale/zh_CN';
import ReactDOM from 'react-dom/client';
import InitRoutes from './routers';
let rootDom = document.getElementById('root');
if (rootDom != null) {
  const root = ReactDOM.createRoot(rootDom);
  root.render(
    <ConfigProvider locale={zhCN}>
      <InitRoutes />
    </ConfigProvider>
  );
}
