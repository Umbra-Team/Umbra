import { sleep } from 'k6';

export default function() {
  console.log('Hello, world!');
  sleep(1);
}