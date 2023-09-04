import { ConfigProvider } from "antd";
import zhCN from 'antd/lib/locale/zh_CN';
import ReactDOM from "react-dom/client";

const Utils = {

    common: {

        renderReactDOM: (child: any, options = {}) => {

            const div = document.createElement('div');
            const { id }: any = options;
            if (id) {
                const e = document.getElementById(id);
                if (e) {
                    document.body.removeChild(e);
                }
                div.setAttribute('id', id);
            }

            document.body.appendChild(div);

            const root = ReactDOM.createRoot(div);
            root.render(<ConfigProvider locale={zhCN}>{child}</ConfigProvider>);

        },
        closeModalContainer: (id: string) => {
            const e = document.getElementById(id);
            if (e) {
                document.body.removeChild(e);
            }
        },
        createModalContainer: (id: string) => {
            //强制清理同名div，render会重复创建modal
            Utils.common.closeModalContainer(id);
            const div = document.createElement('div');
            div.setAttribute('id', id);
            document.body.appendChild(div);
            return div;
        }
    }
}

export default Utils;