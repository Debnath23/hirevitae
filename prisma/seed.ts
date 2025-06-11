// prisma/seed.ts

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Delete all existing users
  await prisma.user.deleteMany();

  // Seed sample users
  await prisma.user.create({
    data: {
        logo: '',
        name: 'rahul',
        email: 'px.pixi.loop@gmail.com',
        password: '1234',
        user_type: 0,
        job_title: 'job title',
        profile_id: 'px.pixi.loopCqTqUKyGLv',
        about: '{"blocks":[{"key":"ec45j","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}',
        social_networks: '[{"show":false,"network":{"value":0,"label":"Facebook"},"url":"https://www.facebook.com/profile.php?id=100022322040864"},{"show":false,"network":{"value":1,"label":"Twitter"},"url":"https://www.facebook.com/profile.php?id=100022322040864"},{"show":false,"network":{"value":2,"label":"Linkedin"},"url":"https://www.facebook.com/profile.php?id=100022322040864"}]',
        career_status: 0,
        show_profile: 0,
        socket_ids: '[]',
        online: 0
      }}),
    
      await prisma.user.create({
    data: {
        name: '',
        email: 'hellohii@hello.hii',
        password: '1234',
        user_type: 0,
        profile_id: 'hellohiiTBHJIvqvfU',
        career_status: 0,
        show_profile: 0,
        socket_ids: JSON.stringify([
          "qro0w0usm1PG5sIhAAAF","5mmtwgIrAmzOI6dYAAAD","gtKEplvVCi1KuZECAAAD",
          "YYlMr7wmjsLGIIHAAAAD","y8EIGGQRsljrmcB2AAAD","CHmXESYtRSnmFAiEAAAD",
          "8yW-jolM9Y-M7isSAAAD","Hwx3ORjyxX5U7dUOAAAD","GqLZLOWazo7kggx1AAAD",
          "nZlCEvpLAbnDvYWKAAAD","Nli5rb9nXNtOEaGPAAAD","d32Pqiqv0A-msH6OAAAC",
          "zmlwwLElYJf7ItDEAAAC","HjG89UvcNYvHIcdnAAAB","-nNfQHN7lvsc5b6WAAAC",
          "zW6w1HscA-K3uRe0AAAC","HdLJTvaxQOz45NEbAAAB","ti76bkevP3a0ShbvAAAD",
          "hJPsClhZPbVZahe-AAAB","Ikg1QDzYdmW-FYlcAAAB","dRYKx8NrM3fhQ_e8AAAD",
          "FbUsQVyo16HapI9uAAAD","Cbj11PBZ9jh0SamgAAAD","qvo-lWIgxfov2Jc2AAAB",
          "mEfAusWm-UGF4jkOAAAC","U4z3i2SDQQW1DqGIAAAD","Xf4E8qIVEelzD--QAAAB",
          "cFiz7kLzxhFkMJswAAAB","eMFyCi84WiOqo_XxAAAB","nR0EKnV8HzBLP0goAAAD",
          "lwyYp4LGqfziBTEEAAAD","ITpHwhD0MJvspoOrAAAB","AlaXwwALMVt67BfcAAAD",
          "ZkCTF41EImyMw9f4AADb","zJjRh1VyMDhuOBN7AADf","kNSofKATsPla1hsHAAA5",
          "9QLU0YCjtIgq7_SHAAA7","HhWjwL7-9rJcjZwhAAA9","kfnU7JnmPizWAuYrAAA_",
          "GunMQxlUD3CAdDKzAABB","Nt_kUpWqD8GCM5N_AABD","CZTdtPoFSDFK5luYAABF",
          "TPWg36JuevliWmLJAAHU","F8WOfALKAtG7Z-wxAAHW","QbKIcYfyb5mujhnrAAHY",
          "bzNcsodyonAwimuDAAHc","vTUoXQ4nwSr2kcCtAAHe","KmJ72iX4wJuEiS8vAAHg",
          "b5GpQh27h2VMCiT_AAHi","9XqkhwS2r_gAOmzpAAHk","Os9xx8Ml0mirTST9AAHm",
          "DBMREoeOHZeYuEn8AAHq","BQtoxQSAKOyvbvSrAAHs","GjZbesDGEWFn3b6sAAHu",
          "6AgXe-dyOL_G1BJ3AAHw","z3-8WVVxWt7o3vNcAAHy","xk0QH_GJiqyrvVvSAAH0",
          "TEh8GmBySzj4cEzUAAH2","I-ZcP4BC06t3KRIEAAH6","LGDUb9sglPxtSfEkAAH8"
        ]),
        online: 1
      }}),
      {
        logo: '',
        name: 'Amigo Infotech',
        email: 'nabinbiswas199315@gmail.com',
        password: '1234',
        user_type: 1,
        phone: '8260040439',
        company_size: 500,
        categories: '[{"value":1,"label":"Advertising"}]',
        profile_id: 'nabinbiswas199315NOzNNnqwGG',
        about: '{"blocks":[{"key":"6bmll","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}',
        portfolio_images: '[]',
        social_networks: '[]',
        career_status: 0,
        show_profile: 0,
        socket_ids: '["00tc0WvQ9o-lO5MnAAAH","pyOQn5TJVrfELJwxAAAB"]',
        online: 1
      },
      {
        name: 'Dhruv Rahul',
        email: 'rahulmondal2777@gmail.com',
        password: '1234',
        user_type: 0,
        profile_id: '1609089546511765',
        career_status: 0,
        show_profile: 0,
        socket_ids: JSON.stringify([
          "KSzd2Rl6iYbu2Fy8AAJJ","SHiEnq56xGGsiewOAAJL","aWjw5lzfpMmZ3w-RAAJN",
          "_7Li6Ws30jSFFknFAACi","k_MSYTa0fxzwjQgYAACk"
        ]),
        online: 1
      },
      {
        logo: 'https://hirevitae-live.s3.ap-south-1.amazonaws.com/featured-image/26-1-2024-1708931214052-22-Annotation 2023-12-16 120045 (1).png',
        name: 'sdfsdf sdfdsf',
        email: 'pxpixi.loop@gmail.com',
        password: '1234',
        user_type: 0,
        phone: '0826004043',
        founded_date: new Date('2024-02-29'),
        gender: 1,
        experience: 34,
        languages: '[{"value":0,"label":"English"}]',
        categories: '[{"value":1,"label":"Advertising"}]',
        profile_id: 'pxpixi.looptTfbxrjINh',
        social_networks: '[]',
        address: 'sdfsdfsdf',
        city: 'Mondhale',
        latitude: '20.632784250388028',
        longitude: '75.41015625',
        career_status: 0,
        show_profile: 0,
        socket_ids: '["jPuQnDJBYnERl4WpAAJw"]',
        online: 1
      },
      {
        logo: 'https://hirevitae-live.s3.ap-south-1.amazonaws.com/featured-image/26-1-2024-1708931874693-23-Annotation 2023-12-16 120045 (1).png',
        name: 'dfsdf sdfsdfdf',
        email: 'pxixi.loop@gmail.com',
        password: '1234',
        user_type: 0,
        phone: '0826004043',
        founded_date: new Date('2024-02-29'),
        gender: 1,
        qualification: 1,
        experience: 34,
        languages: '[{"value":1,"label":"Hindi"}]',
        categories: '[{"value":1,"label":"Advertising"}]',
        profile_id: 'pxixi.loopOODpBHmHVp',
        social_networks: '[]',
        address: 'sdfdf',
        city: 'Bhanupratappur',
        latitude: '20.3034175184893',
        longitude: '81.03515625',
        career_status: 0,
        show_profile: 0,
        socket_ids: '["E2vzg9ziIlbm-5_uAAJy"]',
        online: 1
      },
      {
        logo: 'https://hirevitae-live.s3.ap-south-1.amazonaws.com/featured-image/26-1-2024-1708933509213-24-Annotation 2023-12-16 120045.png',
        banner: 'https://hirevitae-live.s3.ap-south-1.amazonaws.com/banner/26-1-2024-1708933509358-24-pexels-pixabay-459653.jpg',
        name: 'emp asdf',
        email: 'pxoop@gmail.com',
        password: '1234',
        user_type: 1,
        phone: '0826004043',
        website: 'http://t',
        founded_date: new Date('2024-02-29'),
        company_size: 34,
        categories: '[{"value":1,"label":"Advertising"}]',
        profile_id: 'pxoopPyXGSEZcxJ',
        portfolio_images: '[]',
        social_networks: '[]',
        address: 'dfgfdg',
        city: 'Manori F.V.',
        latitude: '22.268764039073965',
        longitude: '81.03515625',
        career_status: 0,
        show_profile: 0,
        socket_ids: JSON.stringify([
          "fIWs6yAmDRp0FuseAAJ2","cPdUShg-llrIQ7TGAAJ4","_4pz2MVDkSXOvtUeAAJ6",
          "RFp_489us6LHzvXfAAK_","BkV29t0AADnnuYjxAALB","j-jb1eKSWp7jKbAPAAMx",
          "_ORDUx418PCxwGK6AAMz"
        ]),
        online: 1
      },
      {
        logo: 'https://hirevitae-live.s3.ap-south-1.amazonaws.com/featured-image/27-1-2024-1709054213304-26-Annotation 2023-12-16 120045.png',
        banner: 'https://hirevitae-live.s3.ap-south-1.amazonaws.com/banner/27-1-2024-1709054213450-26-pexels-pixabay-459653.jpg',
        name: 'sdfsdf',
        email: 'px.pixi.loop@gmail.com',
        password: '1234',
        user_type: 1,
        phone: '0826004043',
        website: 'hrrps://asdf',
        founded_date: new Date('2024-02-29'),
        company_size: 354,
        categories: '[{"value":1,"label":"Advertising"}]',
        profile_id: 'px.pixi.loophMAZYdffEr',
        about: '{"blocks":[{"key":"47iog","text":"sdfsdfdsf","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}',
        portfolio_images: '[]',
        social_networks: '[]',
        address: 'sdf',
        city: 'Kukanar',
        latitude: '18.646245142670608',
        longitude: '81.73828125',
        career_status: 0,
        show_profile: 0,
        socket_ids: JSON.stringify([
          "zqJJ3B61BFtXeWJ4AAKk","Vsw9o_wNuxvEApoTAAKm","xmzHdDlU2FRIxZeGAAKo",
          "blScHJlNZ794ormfAAKq","swS6eSuFsNU1up2cAAKs"
        ]),
        online: 1
      },
      {
        logo: 'https://hirevitae-live.s3.ap-south-1.amazonaws.com/featured-image/28-1-2024-1709103579378-28-Annotation 2023-12-16 120045 (1).png',
        name: 'sdfsdf sdfsdf',
        email: 'pixi.loop@gmail.com',
        password: '1234',
        user_type: 0,
        phone: '0826004043',
        founded_date: new Date('2024-02-29'),
        gender: 1,
        experience: 45,
        languages: '[{"value":0,"label":"English"}]',
        categories: '[{"value":1,"label":"Advertising"}]',
        profile_id: 'pixi.loopczDAWLbbQP',
        about: '{"blocks":[{"key":"4hdtk","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}',
        vision: '{"blocks":[{"key":"8ne0e","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}',
        social_networks: '[]',
        address: 'dfgdfg',
        city: 'Chintapalle',
        latitude: '18.979025953255267',
        longitude: '79.189453125',
        career_status: 0,
        show_profile: 0,
        socket_ids: JSON.stringify([
          "_NL3d8e9TZ3vQKYnAAAs","5nCMvj1G55ohAwTwAAAu","kKUB4xmfrebe4J7uAAAw",
          "LjOruwVg6U8pTZhcAAA0","dEQUH9imXDKRx4MNAAA2","mc9D6SEndrOAXJfvAAA4",
          "xkIgWj4qCQnDYnd2AAA6","3cOeDr84aYlJUoeIAAA8","rBhlnn0SRFZUmENGAAA_",
          "v2Tx4gH0uz3u6HUwAABC","eWboAJ2m0YK2WVmCAABE","2l111dbOMX0YW7mJAABG",
          "nHKAULnAyVwM5SWfAABI","m6M23wahgCt2IounAABK","FbwvHyY0pmf26N36AABM",
          "_4H6WMJHCj-Iub8vAABO","wy-VudntOA0gTlEDAABQ","SBu9vsN-CjoNPj1HAABS",
          "SOo49ucVOZq5cDKIAABU","TYjbkgIOl0tA4pI-AABW","CT28foplDcPrLboRAABY",
          "RT3gzheHYxH-yFblAABa","O36ytWBezZpQYEXaAABc","8c5HC--dy0EGRGPUAACR",
          "Vz2Hb4UCHq3VdpjkAACT","3_NCC4PiVU7V6v_5AACV","-qqRGrygKn3CCNS1AACX",
          "JhhV3MkpxUdek32lAACZ","wfCu4bF2BjDG1LkGAACb","EmfaXDhcuX7jW_6_AACd",
          "1bdDjsWQ6T8bYp9kAACf","y3PWXnofUMoqjh3CAACh","eKs2tK6TrLQSInuLAACj",
          "-Xpj1QIb5ubU2VlKAACl","axUjmniQZ_MNbxAgAACn","LLpDiUHvI2xtgCbRAACp",
          "PE6IwM7f2SzB7iZeAACr","TNk_NO3zJNcJGdciAACt","sQ2taZU8xV5wB3hfAACv",
          "4uc7S0iY1WzUEEhwAACx","pYyzCytLP6SpAFntAACz","urMJSm5hDgBhWy9-AAC1",
          "ZnfQuZYk1E13kVBgAAC3","j69WaDvjcJVd48jdAAC5","RkHy0A0A-jWI81DoAAC7",
          "vDQcj0wgZzfLh7_HAAC9","uLzwrgeKu_G5-qSqAAC_","nbbm2t7ZYOBkzHG5AADB",
          "ylU9sqGmIaBqGasVAADD","QLVEtQnW-NL-8P4BAADF","gre59sq2J8Cl84ZZAADH",
          "iPtmT2Fgtc1dsZQeAADJ","iFELKyHy3jOGlpH0AADL","GHJzNan93x7L7aKQAADN"
        ]),
        online: 1
      }
    ],
    skipDuplicates: true,
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });