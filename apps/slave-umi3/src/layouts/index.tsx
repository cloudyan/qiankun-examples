import {useHistory} from 'umi';
import {Link} from 'umi'
import './index.less'

export default function IndexPage(props: any) {

  const history = useHistory()

  const handleJump = (path: string) => {
    history.push(path)
  }

  return (
    <div className="navs">
      <ul>
        <li><Link to="/home">Home</Link></li>
        <li><Link to="/page1">Page1</Link></li>
        <li><Link to="/page2">Page2</Link></li>
        <li><Link to="/theme">Theme</Link></li>
      </ul>
      <div>
        {props.children}
      </div>
    </div>
  );
}
