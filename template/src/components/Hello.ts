import Vue from 'vue';
import Quasar from 'quasar';
import Component from 'vue-class-component';
import {
    dom,
    event,
    openURL,
    QLayout,
    QToolbar,
    QToolbarTitle,
    QBtn,
    QIcon,
    QList,
    QListHeader,
    QItem,
    QItemSide,
    QItemMain
} from 'quasar';

const
    { viewport } = dom,
    { position } = event,
    moveForce = 30,
    rotateForce = 40,
    RAD_TO_DEG = 180 / Math.PI;

function getRotationFromAccel(accelX, accelY, accelZ) {
    /* Reference: http://stackoverflow.com/questions/3755059/3d-accelerometer-calculate-the-orientation#answer-30195572 */
    const sign = accelZ > 0 ? 1 : -1;
    const miu = 0.001;

    return {
        roll: Math.atan2(accelY, sign * Math.sqrt(Math.pow(accelZ, 2) + miu * Math.pow(accelX, 2))) * RAD_TO_DEG,
        pitch: -Math.atan2(accelX, Math.sqrt(Math.pow(accelY, 2) + Math.pow(accelZ, 2))) * RAD_TO_DEG
    };
}

@Component({
    name: 'hello',
    components: {
        QLayout,
        QToolbar,
        QToolbarTitle,
        QBtn,
        QIcon,
        QList,
        QListHeader,
        QItem,
        QItemSide,
        QItemMain
    }
})
export default class Index extends Vue {
    myVar = 'hi there';
    orienting = window.DeviceOrientationEvent && !(this as any).$q.platform.is.desktop;
    rotating = window.DeviceMotionEvent && !(this as any).$q.platform.is.desktop;
    moveX = 0;
    moveY = 0;
    rotateY = 0;
    rotateX = 0;

    get position() {
        const transform = `rotateX(${this.rotateX}deg) rotateY(${this.rotateY}deg)`;
        return {
            top: this.moveY + 'px',
            left: this.moveX + 'px',
            '-webkit-transform': transform,
            '-ms-transform': transform,
            transform
        };
    }

    launch(url: string): void {
        openURL(url);
    }

    move(evt) {
        const
            { width, height } = viewport(),
            { top, left } = position(evt),
            halfH = height / 2,
            halfW = width / 2
            ;

        this.moveX = (left - halfW) / halfW * -moveForce;
        this.moveY = (top - halfH) / halfH * -moveForce;
        this.rotateY = (left / width * rotateForce * 2) - rotateForce;
        this.rotateX = -((top / height * rotateForce * 2) - rotateForce);
    }

    orient(evt) {
        if (evt.beta === null || evt.gamma === null) {
            window.removeEventListener('deviceorientation', this.orient, false);
            this.orienting = false;

            window.addEventListener('devicemotion', this.rotate, false);
        }
        else {
            this.rotateX = evt.beta * 0.7;
            this.rotateY = evt.gamma * -0.7;
        }
    }
    rotate(evt) {
        if (evt.rotationRate &&
            evt.rotationRate.beta !== null &&
            evt.rotationRate.gamma !== null) {
            this.rotateX = evt.rotationRate.beta * 0.7;
            this.rotateY = evt.rotationRate.gamma * -0.7;
        }
        else {
            /* evt.acceleration may be null in some cases, so we'll fall back
               to evt.accelerationIncludingGravity */
            const
                accelX = evt.acceleration.x || evt.accelerationIncludingGravity.x,
                accelY = evt.acceleration.y || evt.accelerationIncludingGravity.y,
                accelZ = evt.acceleration.z || evt.accelerationIncludingGravity.z - 9.81,
                rotation = getRotationFromAccel(accelX, accelY, accelZ);

            this.rotateX = rotation.roll * 0.7;
            this.rotateY = rotation.pitch * -0.7;
        }
    }

    // lifetime hooks  
    mounted(): void {
        this.$nextTick(() => {
            if (this.orienting) {
                window.addEventListener('deviceorientation', this.orient, false);
            }
            else if (this.rotating) {
                window.addEventListener('devicemove', this.rotate, false);
            }
            else {
                document.addEventListener('mousemove', this.move);
            }
        });
    }
    beforeDestroy() {
        if (this.orienting) {
            window.removeEventListener('deviceorientation', this.orient, false);
        }
        else if (this.rotating) {
            window.removeEventListener('devicemove', this.rotate, false);
        }
        else {
            document.removeEventListener('mousemove', this.move);
        }
    }

}