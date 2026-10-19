import { Link } from 'react-router-dom';
import { EmptyState } from '../components/states';

export function NotFoundPage() {
  return (
    <EmptyState
      emoji="🍽️"
      title="这个页面不存在"
      description="链接可能已经失效，回到首页看看今天吃什么吧。"
      action={
        <Link to="/" className="btn btn-primary">
          回到首页
        </Link>
      }
    />
  );
}
