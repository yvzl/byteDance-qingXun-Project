import Bowser from 'bowser';

const parser = Bowser.getParser(window.navigator.userAgent);

export const isMobileDevice = () => {
    const platform = parser.getPlatform();
    return platform.type === 'mobile' || platform.type === 'tablet';
};