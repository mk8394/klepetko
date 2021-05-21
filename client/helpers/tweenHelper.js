export default class TweenHelper {
    static flashElement(scene, element, rotation, repeat = false, easing = 'Linear', overallDuration = 300, visiblePauseDuration = 500) {
        if (scene && element) {

            let flashDuration = overallDuration - visiblePauseDuration / 2;

            scene.tweens.timeline({
                tweens: [
                    {
                        targets: element,
                        duration: 0,
                        alpha: 1,
                        ease: easing,
                        rotation: 0,
                        scale: 1
                    },
                    {
                        targets: element,
                        duration: flashDuration,
                        alpha: 1,
                        ease: easing,
                        rotation: rotation,
                        scale: 1.5
                    }
                ]
            });
        }
    }

    static resetElement(scene, element, repeat = false, easing = 'Linear', overallDuration = 300, visiblePauseDuration = 500) {
        if (scene && element) {
            let flashDuration = overallDuration - visiblePauseDuration / 2;

            scene.tweens.timeline({
                tweens: [
                    {
                        targets: element,
                        duration: flashDuration,
                        alpha: 1,
                        ease: easing,
                        rotation: 0,
                        scale: 1,
                        onComplete: () => {
                            if (repeat === true) {
                                this.flashElement(scene, element);
                            }
                        }
                    }
                ]
            });
        }
    }

    static loadingRotation(scene, element, rotation, repeat = false, easing = 'Linear', overallDuration = 300, visiblePauseDuration = 500) {
        if (scene && element) {

            let flashDuration = overallDuration - visiblePauseDuration / 2;

            scene.tweens.timeline({
                tweens: [
                    {
                        targets: element,
                        duration: 0,
                        alpha: 1,
                        ease: easing,
                        rotation: 0,
                        scale: 1
                    },
                    {
                        targets: element,
                        duration: flashDuration,
                        alpha: 1,
                        ease: easing,
                        rotation: rotation,
                        scale: 1
                    }
                ]
            });
        }
    }
}