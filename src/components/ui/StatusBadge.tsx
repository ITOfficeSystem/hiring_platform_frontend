import { Badge } from '@chakra-ui/react';
import { getStatusColor } from '../../utils';

interface StatusBadgeProps {
  status: string;
  variant?: 'solid' | 'subtle' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge = ({
  status,
  variant = 'subtle',
  size = 'md',
}: StatusBadgeProps) => {
  const fontSize = size === 'sm' ? 'xs' : size === 'lg' ? 'md' : 'sm';
  const px = size === 'sm' ? 2 : size === 'lg' ? 4 : 3;
  const py = size === 'sm' ? 1 : 1;

  return (
    <Badge
      colorScheme={getStatusColor(status)}
      variant={variant}
      fontSize={fontSize}
      px={px}
      py={py}
      borderRadius={20}
    >
      {status.replace('_', ' ').toUpperCase()}
    </Badge>
  );
};
