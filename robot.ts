import { random } from './random';

type Attributes = {
  life: number; // Vida para batalha
  damage: number; // Dano causado no outro inimigo
  shield: number; // Chances defender um golpe
};

type Robot = {
  name: string;
  level: number;
  attributes: Attributes;
};

const BASE_LIFE = 100.0;
const PERCENTAGEM_LIFE_PER_LEVEL = 0.0025; // 0.25%;
const PERCENTAGEM_DAMAGE = 0.0012; // 0.12%;

let robot_1: Robot = {
  name: 'Maverik',
  level: 1,
  attributes: {
    life: 100,
    damage: 5,
    shield: 10,
  },
};

let robot_2: Robot = {
  name: 'Edson',
  level: 1,
  attributes: {
    life: 100,
    damage: 5,
    shield: 10,
  },
};

const score_board = {
  robot_1: 0,
  robot_2: 0,
};

const MD3 = {
  robot_1: 0,
  robot_2: 0,
};

function rebootGame() {
  score_board.robot_1 = 0;
  score_board.robot_2 = 0;

  robot_1 = {
    name: 'Maverik',
    level: 1,
    attributes: {
      life: 100,
      damage: 5,
      shield: 10,
    },
  };

  robot_2 = {
    name: 'Edson',
    level: 1,
    attributes: {
      life: 100,
      damage: 5,
      shield: 10,
    },
  };
}

setInterval(() => {
  if (MD3.robot_1 >= 2 || MD3.robot_2 >= 2) {
    logRobots('FINISH!');
    process.exit();
  }

  if (score_board.robot_1 >= 100) {
    MD3.robot_1 += 1;
    rebootGame();
    return;
  }

  if (score_board.robot_2 >= 100) {
    MD3.robot_2 += 1;
    rebootGame();
    return;
  }

  if (robot_1.attributes.life <= 0 || robot_2.attributes.life <= 0) {
    recalculateAttributes(robot_1);
    recalculateAttributes(robot_2);

    return;
  }
  if (robot_1.attributes.life > 0 && robot_2.attributes.life > 0) battle();
}, 1);

function battle() {
  const chance_robot_1 = random(0, 100);
  const chance_robot_2 = random(0, 100);

  if (chance_robot_1 > robot_1.attributes.shield) {
    robot_1.attributes.life -= robot_2.attributes.damage;
    if (robot_1.attributes.life < 0) robot_1.attributes.life = 0;
  }

  if (chance_robot_2 > robot_2.attributes.shield) {
    robot_2.attributes.life -= robot_1.attributes.damage;
    if (robot_2.attributes.life < 0) robot_2.attributes.life = 0;
  }

  if (robot_1.attributes.life <= 0 && robot_2.attributes.life <= 0) {
    score_board.robot_1 += 1;
    score_board.robot_2 += 1;

    logRobots('EMPATE');

    robot_1 = increaseLevels(robot_1, 1);
    robot_2 = increaseLevels(robot_2, 1);

    robot_1 = recalculateAttributes(robot_1);
    robot_2 = recalculateAttributes(robot_2);

    return;
  }

  if (robot_1.attributes.life > 0 && robot_2.attributes.life <= 0) {
    score_board.robot_1 += 1;

    logRobots('ROBOT 1 WIN!');
    robot_1 = increaseLevels(robot_1, 1);
    robot_1 = recalculateAttributes(robot_1);

    return;
  }

  if (robot_1.attributes.life <= 0 && robot_2.attributes.life > 0) {
    score_board.robot_2 += 1;

    logRobots('ROBOT 2 WIN!');
    robot_2 = increaseLevels(robot_2, 1);
    robot_2 = recalculateAttributes(robot_2);

    return;
  }

  logRobots('BATTLE RUNNING....');
}

function logRobots(message: string) {
  console.clear();
  console.log(message);

  console.table(MD3);
  console.table(score_board);
  console.log(robot_1);
  console.log(robot_2);
}

function increaseLevels(robot: Robot, levels: number): Robot {
  robot.level += levels;

  return robot;
}

function recalculateAttributes(robot: Robot): Robot {
  const increase_life = BASE_LIFE * (robot.level * PERCENTAGEM_LIFE_PER_LEVEL);
  robot.attributes.life = BASE_LIFE + increase_life;
  robot.attributes.life = Number(robot.attributes.life.toFixed(2));

  const increase_damage = random(1, 10) * PERCENTAGEM_DAMAGE;
  robot.attributes.damage += increase_damage;
  robot.attributes.damage = Number(robot.attributes.damage.toFixed(2));

  return robot;
}
