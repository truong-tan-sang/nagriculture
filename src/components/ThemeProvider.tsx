export const neumorphism = {
    layoutX: { xs: 2, sm: 6, md: 12, lg: 20 },
    card: '#fafafc',
    background: '#f5f5f7',
    hover: '4px 4px 6px rgba(0, 0, 0, 0.15), -4px -4px 6px rgba(255, 255, 255, 1), inset 0 0 0 1px #eaeaeaff',
    outline: '0 0 1px rgba(0, 0, 0, 0.25)',
    upperbackground: '0px 4px 6px rgba(255, 255, 255, 0.5), 0px -4px 6px rgba(255, 255, 255, 0.5)',
    // upperbackground: '',
}
export const HoverBackground = {
    background: `${neumorphism.card}99`,
    backdropFilter: 'blur(2px)',
}

export const BevelButton = {
    background: neumorphism.card,
    borderRadius: 4,
    p:2,
}