import type { LucideIcon } from 'lucide-react-native';
import { cssInterop } from 'nativewind';

export function iconWithClassName(icon: LucideIcon) {
  const result = cssInterop(icon, {
    className: {
      target: 'style',
      nativeStyleToProp: {
        color: true,
        opacity: true,
      },
    },
    fillClassName: {
      target: false,
      nativeStyleToProp: {
        color: 'fill',
      }
    }
  });

  return result;
}
