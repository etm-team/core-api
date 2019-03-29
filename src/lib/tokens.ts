import fs from 'mz/fs';
import Promise from 'bluebird';
import config from 'config';
import jwt from 'jsonwebtoken';

function getAlgorithm(): string {
  return config.get('jwt.algorithm');
}

function getMaterial(): Promise<string> {
  const algorithm = getAlgorithm();
  const material = config.get<string>('jwt.material');

  if (algorithm.startsWith('HS')) {
    return Promise.resolve(material);
  }

  return Promise.resolve(fs.readFile(material, {encoding: 'utf-8'}));
}

function sign(data: any): Promise<string> {
  return new Promise((resolve, reject) => {
    getMaterial().then(material => {
      jwt.sign(data, material, (err, token) => {
        if (err) {
          return reject(err);
        }

        resolve(token);
      });
    });
  });
}

export default {
  getMaterial,
  getAlgorithm,
  sign
};
