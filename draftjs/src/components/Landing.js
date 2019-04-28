/* eslint-disable */
import React from 'react';
import { Table, Button, Switch, Input, Menu, Dropdown, Icon, Popconfirm } from 'antd';
import 'antd/dist/antd.css';
import { withRouter } from 'react-router-dom';
import request from 'request';
import axios from 'axios';
import Walkthrough from './Walkthrough';
import CardNote from './CardNote/CardNote';
import LandingNavigation from './LandingNavigation';
import '../css/landing.css';
import { mergeSort } from '../defaults/constants';
import features from '../images/features.png';
import layout from '../images/layout.png';
import book from '../images/book_landing.png';
import macbook from '../images/macbook.png';
import ipad from '../images/ipad.png';
import test from '../images/test.gif';
import test_2 from '../images/test_2.gif';
import word_spacing from '../images/word_spacing.gif';
import line_spacing from '../images/line_spacing.gif';
import change_color from '../images/change_color.gif';
import MailchimpSubscribe from "../../node_modules/react-mailchimp-subscribe"
import { Row, Col, Card, List, Tooltip, Carousel, Tabs, Select } from 'antd';

class Landing extends React.Component {

	login() {
        this.props.history.push('/login')
    }

    createAccount() {
    	this.props.history.push('/create-account')
    }


	render() {

		const signup_url = "https://instituteofethics.us12.list-manage.com/subscribe/post?u=dab096c99da661a7a63bf35f0&amp;id=fbc442cd0f";


		const ColoredLine = ({ color }) => (
		    <hr
		        style={{
		            color: color,
		            backgroundColor: color,
		            height: 1
		        }}
		    />
		);


		const design = [
			'Soft background note colors',
			'Easy-to-read fonts',
			'Personalized interface',
		];

		const features = [
			'Filtered notes',
			'categorization',
			'Text-to-speech',
			'Convert-to-pdf',
			'Word-hyphenation',
		];

		const buglist = [
			'HTML/CSS gets inconsistent when you resize the window',
			'CovertToPDF doesn\'t work pefectly: it only works with background color, bold and italic',
			'TextToSpeech doesn\'t work consistently: it does not read the proper text sometimes. And it only works in Chrome',
			'Word-hyphenation functionality is disabled because we are not able to set the React state properly. But the algorithm is properly implemented and can be used in the future development',
			'Trash can icon on the notecard does not work',
			'Text does not wrap when typing a note. It just overlaps text on eachother',
		];


		function onChange(a, b, c) {
		  console.log(a, b, c);
		}

		const TabPane = Tabs.TabPane;


    
	    return (
	      <div className={["testing"]}>
	      	<LandingNavigation/>
	      	<Row className={["centered-text", "full-container", "intro"]} style ={{ backgroundImage: "url("+book+")" }}>
	      		<Col span={24}>
		    		<p className={"header"}>A simple, free to use note taking application for people affected with dyslexia!</p>
		    		<Tooltip title="If you don't have an account already you can sign up on the next page!"><Button style={{"height": "50px", "width": "230px", "font-size": "18px"}} onClick={() => this.createAccount()} type="primary">Create an account!</Button></Tooltip>
	      		</Col>
	      	</Row>
	      	<Row className={["centered-text"]}>
		    	<Col span={24}>
		    		<Card className={["landing-card", "centered-text", "centered", "shadow", "pushed"]} style={{"margin-top":"20px"}}>
		    			<h3>This application is designed to continually innovate, constantly adding new features and 
		    			functionalities that make taking notes easier for people with dyslexia. We have aggregated <i>simple</i> and 
		    			<i> helpful</i> features in an effort to make an accessible and impactful application</h3>
		    			<Col span={12} style={{"margin-bottom":"auto","display" : "flex", "justify-content": "center", "align-items": "center"}}>
		    				<Tooltip title="We will never use your email or information unless we are explicitly given permission. This account is for your use only."><Button style={{"height": "45px", "width": "160px", "font-size": "18px", "flex-shrink": 0}} onClick={() => this.createAccount()} type="primary">Create an account!</Button></Tooltip>
		    			</Col>
		    			<p>* We are currently at a beta version of the app, meaning we are testing out the features and functionality so 
		    			that our final product will be as helpful and stable as possible!</p>
		    		</Card>
		    	</Col>
		    </Row>
	      	<Row className={"centered"}>
			    <Col xs={{ span: 24}} lg={{ span: 10}}>
			    	<Card className={["landing-card", "centered-text", "centered", "shadow"]}>
						<h2>Beautiful, personalized interface</h2>
					    <List
					      dataSource={design}
					      renderItem={item => (<List.Item>{item}</List.Item>)}
					    />
					</Card>
			    </Col>
			    <Col xs={{ span: 24}} lg={{ span: 14}}>
			    	<img className={"demo-images"} src={macbook}/>
			    </Col>
			</Row>
	      	<Row className={"centered"}>
		  		<Col xs={{ span: 24}} lg={{ span: 14}}>
					<img className={"demo-images"} src={ipad}/>
				</Col>
		    	<Col xs={{ span: 24}} lg={{ span: 10}}>
			    	<Card className={["landing-card", "centered-text", "centered", "shadow"]}>
			    		<h2>Easy to use tools made for people with Dyslexia</h2>
			    		<List
					      dataSource={features}
					      renderItem={item => (<List.Item>{item}</List.Item>)}
					    />
			    	</Card>
			    </Col>

		    </Row>
		    <Row className={["centered"]}>
		    	<Col span={24} style={{"margin-top":"50px", "margin-bottom":"50px"}}>
					<h3> Sign up for our beta test to receive up-to-date information about WriteFree!</h3>
	    			<MailchimpSubscribe url={signup_url}/>
				</Col>
			</Row>
		    <Row className={["centered"]}>
		    	<Col span={24}>
		    		<h1 style={{"text-align":"center"}}>Feature Examples</h1>
		    		<Tabs tabPosition={top}>
						<TabPane tab="Word Spacing" key="1">
						    <img src={word_spacing} style={{"width":"80%", "height":"90%"}}/>
						</TabPane>
						<TabPane tab="Line Spacing" key="2">
						    <img src={line_spacing} style={{"width":"80%", "height":"90%"}}/>
						</TabPane>
						<TabPane tab="Change Color" key="3">
						    <img src={change_color} style={{"width":"80%", "height":"90%"}}/>
						</TabPane>
		        	</Tabs>
		    	</Col>
			</Row>
			<Row>
		    	<Col span={18} offset={3}>
		    		<p className={["header"]} style={{"text-align":"center"}}>Known Bugs</p>
		    		<List
				      dataSource={buglist}
				      renderItem={item => (<List.Item>{item}</List.Item>)}
				    />
		    	</Col>
		    </Row>
		    <Row className={["centered-text"]}>
		    	<Col span={24}>
		    		<Col span={12} offset={6}>
		    			<Card className={["styled-card", "shadow"]} style={{"margin-top":"20px"}}>
							<p>WriteFree is a not for profit, open-source application! Help contribute to our cause</p>
						</Card>
		    		</Col>
		    		<Col span={12} offset={6}>
		    			<a target="_blank" href="https://github.com/chris-ackerman/writefree-fe"><Button style={{"height": "50px", "width": "200px", "font-size": "18px", "margin":"20px"}} type="primary">Github</Button></a>
		    		</Col>
		    	</Col>
		    </Row>
		    <Row className={["centered-text"]}>
		    	<Col span={24} className={["footer"]}>
		    		<ColoredLine color="grey"/>
		    		<Col xs={{ span: 24}} lg={{ span: 14}}>
						<h3> Sign up for our beta test to receive up-to-date information about WriteFree!</h3>
		    			<MailchimpSubscribe url={signup_url}/>
					</Col>
			    	<Col xs={{ span: 24}} lg={{ span: 10}}>
				    	<h3>WriteFree is an <a target="_blank" href="https://instituteofethics.org"><b>Institute of Ethics</b></a> initiative!</h3>
				    </Col>
		    	</Col>
		    </Row>
	      	
	      </div>
	    );
  	}
}

export default withRouter(Landing);