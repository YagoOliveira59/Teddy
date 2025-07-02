interface MenuButtonProps {
  onClick: () => void;
  status: 'open' | 'closed';
}

function MenuButton({ onClick, status }: MenuButtonProps) {
  return (
    <div
      className={`menu-button flex flex-col gap-2 cursor-pointer ${status}`}
      onClick={onClick}
    >
      <span className="w-7 h-0.5 bg-[#666666] line top-line"></span>
      <span className="w-7 h-0.5 bg-[#666666] line middle-line"></span>
      <span className="w-7 h-0.5 bg-[#666666] line bottom-line"></span>
    </div>
  );
}

export default MenuButton;