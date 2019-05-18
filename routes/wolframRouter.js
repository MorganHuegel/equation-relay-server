const express = require('express');
const axios = require('axios');

const wolframRouter = express.Router();
const wolframBaseUrl = 'http://api.wolframalpha.com/v2/query';

const { WOLFRAM_API_KEY } = require('../config');

wolframRouter.post('/', (req, res) => {
  let { question, answer } = req.body;

  return axios.get(wolframBaseUrl, {
    params: {
      appid: WOLFRAM_API_KEY,
      input: question,
      format: 'plaintext',
      output: 'json'
    }
  })
    .then(wolframResp => {
      const queryResult = wolframResp.data.queryresult;

      if (queryResult.error) {
        return res.status(400).json({correct: false, incorrect: false, message: 'Error occured with Wolfram check.'});

      } else if (!queryResult.success) {
        return res.json({correct: false, incorrect: false, message: 'Wolfram could not validate this answer.'});

      } else if (queryResult.numpods <= 0) {
        return res.json({correct: false, incorrect: false, message: 'Wolfram response says successful, but there are no pods in response.'});

      } else {
        let resultPod, decimalPod;
        queryResult.pods.forEach(pod => {
          if (pod.title === 'Result' || pod.title === 'Solution' || pod.title === 'Exact result') resultPod = pod;
          if (pod.title === 'Decimal approximation') decimalPod = pod;
        });

        if (!resultPod && !decimalPod) {
          return res.json({correct: false, incorrect: false, message: `Wolfram could not validate this answer.`});
        }

        const wolframAnswer = resultPod ? 
          resultPod.subpods[resultPod.numsubpods - 1].plaintext.replace(/[^\-0-9./]/g, '') :
          decimalPod.subpods[decimalPod.numsubpods - 1].plaintext.replace(/[^\-0-9./]/g, '');

        if (decimalPod) {
          return res.json({correct: false, incorrect: true, message: `Are you sure this answer isn't ${wolframAnswer}?`, wolframAnswer});
        }

        const isCorrect = wolframAnswer === answer;
        return isCorrect ? 
          res.json({correct: true, incorrect: false}) : 
          res.json({correct: false, incorrect: true, message: `Are you sure the answer isn't ${wolframAnswer}?`, wolframAnswer});
      }
    })
    .catch(err => {
      console.log('WOLFRAM GET ERROR: ', err);
      return res.status(400).json({errorMessage: err.message});
    });
});

module.exports = { wolframRouter };