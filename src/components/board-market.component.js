import React, { Component } from "react";
import {
  AppstoreOutlined,
  BarChartOutlined,
  CloudOutlined,
  ShopOutlined,
  TeamOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';


import { Tabs, Layout, Menu, theme } from 'antd';
import HeadMarket from './components/market/head-market.component';
import ObjectsMarket from './components/market/objects-market.component';
import SelectorMarketObject from './components/market/selector-market-oject.component';




const { Header, Content, Footer, Sider } = Layout;
const items: MenuProps['items'] = [
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
  BarChartOutlined,
  CloudOutlined,
  AppstoreOutlined,
  TeamOutlined,
  ShopOutlined,
].map((icon, index) => ({
  key: String(index + 1),
  icon: React.createElement(icon),
  label: `nav ${index + 1}`,
}));
const {colorBgContainer, colorBgBase} = theme;
const LightBgColor = '#FFFFFF';

export default class BoardMarket extends Component {
  constructor(props) {
    super(props);

    this.state = {
      market: undefined,
      subject: undefined,
      person: undefined,
      asset: undefined,
    };
    this.onChangeMarket  = this.onChangeMarket.bind(this);
    this.onChangeSubject = this.onChangeSubject.bind(this);
    this.onChangePerson  = this.onChangePerson.bind(this);
    this.onChangeAsset   = this.onChangeAsset.bind(this);
  }                                                
  onChangeMarket(uuid)
  {
    this.setState({
      market: uuid,
    });
  }
  onChangeSubject(uuid)
  {
    this.setState({
      subject: uuid,
    });
  }

  onChangePerson(uuid)
  {
    this.setState({
      person: uuid,
    });
  }

  onChangeAsset(uuid)
  {
    this.setState({
      asset: uuid,
    });
  }


  componentDidMount() {
  }

  render() {
    const {tabItems} = this.state;

  return (
     <Layout>
      <Header  style={{ position: 'sticky', top: 0, zIndex: 1, width: '100%',background: LightBgColor }}>
        <HeadMarket onChangeMarket={this.onChangeMarket}/>
       </Header>
       <Layout>
        <Sider
          theme="light"
          width={400}
          style={{
            overflow: 'auto',
            height: '100vh',
            
           }}
          >
           <ObjectsMarket
              onChangeSubject = {this.onChangeSubject}
              onChangePerson = {this.onChangePerson}
              onChangeAsset  = {this.onChangeAsset}
           />
          </Sider>
         <Content
           style={{
             pandding: '20px',
             overflow: 'auto',
             height: '100vh',
             background: LightBgColor,
           }}
         >
             <SelectorMarketObject
                market={this.state.market}
                subject={this.state.subject}
                person={this.state.person}
                asset={this.state.asset}
             />
         </Content>
        </Layout>
      </Layout>  );
  }
}
                                                                         