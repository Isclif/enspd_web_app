import { ReactNode, useState, useEffect } from 'react';

interface SidebarLinkGroupProps {
  children: (handleClick: () => void, open: boolean) => ReactNode;
  activeCondition: boolean;
  onClose: () => void;
}

const SidebarLinkGroup = ({
  children,
  activeCondition,
  onClose,
}: SidebarLinkGroupProps) => {
  const [open, setOpen] = useState<boolean>(activeCondition);

  const handleClick = () => {
    setOpen(!open);
    onClose();
  };

    // Fermer le dropdown si un clic se produit en dehors
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        if (!target.closest('.dropdown')) {
          setOpen(false);
          onClose();
        }
      };
  
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

  return (
    <li className="dropdown">
      {children(handleClick, open)}
    </li>
  )
};

export default SidebarLinkGroup;
