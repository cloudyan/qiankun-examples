import {useHistory} from 'umi';
import {Link} from 'umi'

export default function IndexPage(props: any) {

  const history = useHistory()

  const handleJump = (path: string) => {
    history.push(path)
  }

  return (
    <div>
      <div style={{display: 'flex'}}>
        <ul>
          <li><Link to="/home">home</Link></li>
          <li><Link to="/page1">page1</Link></li>
          <li><Link to="/page2">page2</Link></li>
        </ul>
      </div>
      {props.children}
    </div>
  );
}
