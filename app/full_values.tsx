import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import HealthKit, { HKQuantityTypeIdentifier, HKCategoryTypeIdentifier } from '@kingstinct/react-native-healthkit';

const HealthKitStepsTest = () => {
  const [steps, setSteps] = useState(null);
  const [sleep, setSleep] = useState(null);
  const [heartRate, setHeartRate] = useState(null);
  const [bloodPressure, setBloodPressure] = useState(null);
  const [temperature, setTemperature] = useState(null);
  const [pulseOximeter, setPulseOximeter] = useState(null);
  
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
    const fetchSleep = async () => {
      await HealthKit.requestAuthorization([HKCategoryTypeIdentifier.sleepAnalysis]);
      
      const sleepData = await HealthKit.getMostRecentCategorySample(HKCategoryTypeIdentifier.sleepAnalysis);
      setSleep(sleepData ? sleepData.value : 'No Data');
    };

    fetchSleep();
  }, []);

  useEffect(() => {
    const fetchHeartRate = async () => {
      await HealthKit.requestAuthorization([HKQuantityTypeIdentifier.heartRate]);
      
      const { quantity } = await HealthKit.getMostRecentQuantitySample(HKQuantityTypeIdentifier.heartRate);
      setHeartRate(quantity);
    };

    fetchHeartRate();
  }, []);

  useEffect(() => {
    const fetchBloodPressure = async () => {
      await HealthKit.requestAuthorization([HKQuantityTypeIdentifier.bloodPressureSystolic, HKQuantityTypeIdentifier.bloodPressureDiastolic]);
      
      const systolic = await HealthKit.getMostRecentQuantitySample(HKQuantityTypeIdentifier.bloodPressureSystolic);
      const diastolic = await HealthKit.getMostRecentQuantitySample(HKQuantityTypeIdentifier.bloodPressureDiastolic);
      setBloodPressure(systolic && diastolic ? `${systolic.quantity}/${diastolic.quantity}` : 'No Data');
    };

    fetchBloodPressure();
  }, []);

  useEffect(() => {
    const fetchTemperature = async () => {
      await HealthKit.requestAuthorization([HKQuantityTypeIdentifier.bodyTemperature]);
      
      const { quantity } = await HealthKit.getMostRecentQuantitySample(HKQuantityTypeIdentifier.bodyTemperature);
      setTemperature(quantity);
    };

    fetchTemperature();
  }, []);

  useEffect(() => {
    const fetchPulseOximeter = async () => {
      await HealthKit.requestAuthorization([HKQuantityTypeIdentifier.oxygenSaturation]);
      
      const { quantity } = await HealthKit.getMostRecentQuantitySample(HKQuantityTypeIdentifier.oxygenSaturation);
      setPulseOximeter(quantity);
    };

    fetchPulseOximeter();
  }, []);

  useEffect(() => {
    const subscribeToHeartRate = async () => {
      const authorized = await HealthKit.requestAuthorization([HKQuantityTypeIdentifier.heartRate]);
      if (!authorized) return;

      const unsubscribe = HealthKit.subscribeToChanges(HKQuantityTypeIdentifier.heartRate, async () => {
        const { quantity } = await HealthKit.getMostRecentQuantitySample(HKQuantityTypeIdentifier.heartRate);
        setHeartRate(quantity ?? 'No Data');
      });

      return () => unsubscribe();
    };

    subscribeToHeartRate();
  }, []);

  useEffect(() => {
    const subscribeToBloodPressure = async () => {
      const authorized = await HealthKit.requestAuthorization([HKQuantityTypeIdentifier.bloodPressureSystolic, HKQuantityTypeIdentifier.bloodPressureDiastolic]);
      if (!authorized) return;

      const unsubscribe = HealthKit.subscribeToChanges([HKQuantityTypeIdentifier.bloodPressureSystolic, HKQuantityTypeIdentifier.bloodPressureDiastolic], async () => {
        const systolic = await HealthKit.getMostRecentQuantitySample(HKQuantityTypeIdentifier.bloodPressureSystolic);
        const diastolic = await HealthKit.getMostRecentQuantitySample(HKQuantityTypeIdentifier.bloodPressureDiastolic);
        setBloodPressure(systolic && diastolic ? `${systolic.quantity}/${diastolic.quantity}` : 'No Data');
      });

      return () => unsubscribe();
    };

    subscribeToBloodPressure();
  }, []);

  useEffect(() => {
    const subscribeToTemperature = async () => {
      const authorized = await HealthKit.requestAuthorization([HKQuantityTypeIdentifier.bodyTemperature]);
      if (!authorized) return;

      const unsubscribe = HealthKit.subscribeToChanges(HKQuantityTypeIdentifier.bodyTemperature, async () => {
        const { quantity } = await HealthKit.getMostRecentQuantitySample(HKQuantityTypeIdentifier.bodyTemperature);
        setTemperature(quantity ?? 'No Data');
      });

      return () => unsubscribe();
    };

    subscribeToTemperature();
  }, []);

  useEffect(() => {
    const subscribeToPulseOximeter = async () => {
      const authorized = await HealthKit.requestAuthorization([HKQuantityTypeIdentifier.oxygenSaturation]);
      if (!authorized) return;

      const unsubscribe = HealthKit.subscribeToChanges(HKQuantityTypeIdentifier.oxygenSaturation, async () => {
        const { quantity } = await HealthKit.getMostRecentQuantitySample(HKQuantityTypeIdentifier.oxygenSaturation);
        setPulseOximeter(quantity ?? 'No Data');
      });

      return () => unsubscribe();
    };

    subscribeToPulseOximeter();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 20 }}>Steps: {steps !== null ? steps : 'Loading...'}</Text>
      <Text style={{ fontSize: 20, marginTop: 10 }}>Sleep: {sleep !== null ? sleep : 'Loading...'}</Text>
      <Text style={{ fontSize: 20, marginTop: 10 }}>Heart Rate: {heartRate !== null ? heartRate : 'Loading...'}</Text>
      <Text style={{ fontSize: 20, marginTop: 10 }}>Blood Pressure: {bloodPressure !== null ? bloodPressure : 'Loading...'}</Text>
      <Text style={{ fontSize: 20, marginTop: 10 }}>Temperature: {temperature !== null ? temperature : 'Loading...'}</Text>
      <Text style={{ fontSize: 20, marginTop: 10 }}>Pulse Oximeter: {pulseOximeter !== null ? pulseOximeter : 'Loading...'}</Text>
    </View>
  );
};

export default HealthKitStepsTest;