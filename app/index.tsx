import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import HealthKit, { HKQuantityTypeIdentifier } from '@kingstinct/react-native-healthkit';

const HealthKitStepsTest = () => {
  const [steps, setSteps] = useState(null);

  useEffect(() => {
    const fetchSteps = async () => {
      const isAvailable = await HealthKit.isHealthDataAvailable();
      if (!isAvailable) {
        console.warn('HealthKit is not available');
        return;
      }

      await HealthKit.requestAuthorization([HKQuantityTypeIdentifier.stepCount]);
      const { quantity } = await HealthKit.getMostRecentQuantitySample(HKQuantityTypeIdentifier.stepCount);
      setSteps(quantity);
    };

    fetchSteps();
  }, []);

  useEffect(() => {
    let unsubscribe;

    const subscribeToStepCount = async () => {
      await HealthKit.requestAuthorization([HKQuantityTypeIdentifier.stepCount]);
      unsubscribe = HealthKit.subscribeToChanges(HKQuantityTypeIdentifier.stepCount, async () => {
        const { quantity } = await HealthKit.getMostRecentQuantitySample(HKQuantityTypeIdentifier.stepCount);
        setSteps(quantity);
      });
    };

    subscribeToStepCount();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  useEffect(() => {
    // Fallback polling mechanism every 10 seconds
    const interval = setInterval(async () => {
      const { quantity } = await HealthKit.getMostRecentQuantitySample(HKQuantityTypeIdentifier.stepCount);
      setSteps(quantity);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 20 }}>Steps: {steps !== null ? steps : 'Loading...'}</Text>
    </View>
  );
};

export default HealthKitStepsTest;
