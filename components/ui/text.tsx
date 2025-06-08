import * as Slot from '@rn-primitives/slot';
import type { SlottableTextProps, TextRef } from '@rn-primitives/types';
import * as React from 'react';
import { ActivityIndicator, Text as RNText } from 'react-native';
import { cn } from '~/lib/utils';

type TextClassContextType = {
  textClass: string | undefined;
  loading: boolean | undefined;
};
const TextClassContext = React.createContext<TextClassContextType>({
  textClass: undefined,
  loading: undefined,
});

const Text = React.forwardRef<TextRef, SlottableTextProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const { textClass, loading } = React.useContext(TextClassContext);
    const Component = asChild ? Slot.Text : RNText;
    return !loading ? (
      <Component
        className={cn(
          'text-base text-foreground web:select-text',
          textClass,
          className
        )}
        ref={ref}
        {...props}
      />
    ) : (
      <ActivityIndicator size="small" className={textClass} />
    );
  }
);
Text.displayName = 'Text';

export { Text, TextClassContext };
