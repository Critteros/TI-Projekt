import '../css/landing.css';
import '@fontsource/roboto';
import { getCanvas } from '@/client/selectors/landing';
import Renderer from '@/client/Renderer';

const renderer = new Renderer(getCanvas());
renderer.animate();

export {};
