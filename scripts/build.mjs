import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
// import { execSync } from 'child_process';
import minimist from 'minimist';
import { parseArgs } from './utils.mjs';
import { $, execa } from 'execa';

const swcJsonPath = '../.swcrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const args = parseArgs(minimist(process.argv.slice(2)));

const prismaFile = '../prisma/schema.prisma';

// 读取.env的配置文件
// 判断tenant模式，并根据模式来创建对应的Prisma客户端文件
const envFilePaths = [`.env.${process.env.NODE_ENV || `development`}`, '.env'];

const parsedConfig = dotenv.config({ path: '.env' }).parsed;

function readJsonFile(filePath) {
  const data = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(data);
}

function writeJsonFile(filePath, data) {
  const content = JSON.stringify(data, null, 2);
  fs.writeFileSync(filePath, content, 'utf8');
}

async function generatePrismaClients() {
  envFilePaths.forEach((path) => {
    if (path === '.env') return;
    const config = dotenv.config({ path });
    Object.assign(parsedConfig, config.parsed);
  });

  const tenantMode = parsedConfig['TENANT_MODE'];

  const clientsGenerate = async (result, type) => {
    const data = result
      .replace(
        /(generator client\s*\{\s*[^}]*output\s*=\s*)".*"/,
        `$1"./clients/${type}"`,
      )
      .replace(
        /(datasource db\s*\{\s*[^}]*provider\s*=\s*)".*"/,
        `$1"${type}"`,
      );
    // console.log('🚀 ~ data:', data);
    // 写入schema.prisma文件
    fs.writeFileSync(path.join(__dirname, prismaFile), data);

    // 2.执行npx prisma generate产生新的clients文件
    const { stdout } = await execa('npx', ['prisma', 'generate'], {
      cwd: path.join(__dirname, '..'),
    });
    console.log(stdout);
  };

  const result = fs.readFileSync(path.join(__dirname, prismaFile), 'utf8');

  if (tenantMode === 'true') {
    const tenantDBType = parsedConfig['TENANT_DB_TYPE'];
    // console.log('🚀 ~ result:', result);
    const DBArr = tenantDBType ? tenantDBType.split(',') : [];
    // console.log('🚀 ~ DBArr:', DBArr);
    // 判断arr中的元素是属于下面的[ 'typeorm', 'prisma', 'mongoose' ]其中的一个
    if (!['typeorm', 'prisma', 'mongoose'].every((o) => DBArr.includes(o))) {
      throw new Error(
        'TENANT_DB_TYPE must be one of [typeorm, prisma, mongoose]',
      );
    }

    if (DBArr.includes('prisma')) {
      // 根据.env中的prisma数据库类型来产生对应的clients
      const types = parsedConfig['PRISMA_DB_TYPE'];
      if (types) {
        const typesArr = types.split(',');
        if (typesArr.length) {
          for (const type of typesArr) {
            // 1.替换schema中的数据库类型
            await clientsGenerate(result, type);
          }
        }
      }
    }
  } else {
    // 不是多orm的模式
    await clientsGenerate(result, 'postgresql');
    await clientsGenerate(result, 'mysql');
  }
}

async function swcBuild() {
  const swcPath = path.join(__dirname, swcJsonPath);
  // 读取swc配置文件
  const swcJson = readJsonFile(swcPath);
  delete args['_'];
  // 把args中的对应的配置项设置到swcJson中
  const newData = { ...swcJson, ...args };
  // 写swc配置文件
  writeJsonFile(swcPath, newData);
  // 执行npm run build命令
  const { stdout } = await $`npm run build`;
  console.log(stdout);

  // 恢复之前的数据
  writeJsonFile(swcPath, swcJson);
}

const run = async () => {
  if (args['prismaClients']) {
    await generatePrismaClients().catch((err) => {
      console.log('generatePrismaClients err', err);
    });
    return;
  }
  await swcBuild();
};

run();
