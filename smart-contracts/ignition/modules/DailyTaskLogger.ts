import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const DailyTaskLoggerModule = buildModule("DailyTaskLoggerModule", (m) => {
  const logger = m.contract("DailyTaskLogger");

  return { logger };
});

export default DailyTaskLoggerModule;