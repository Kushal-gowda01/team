/**
 * Logger Utility
 * Provides comprehensive logging for debugging and monitoring
 */

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

interface LogEntry {
  timestamp: Date;
  level: LogLevel;
  message: string;
  context?: string;
  data?: any;
  error?: string;
}

class Logger {
  private logs: LogEntry[] = [];
  private maxLogs = 500; // Keep last 500 logs
  private isDevelopment = process.env.NODE_ENV === 'development';

  private formatMessage(entry: LogEntry): string {
    const timestamp = entry.timestamp.toISOString();
    const level = entry.level.padEnd(6);
    const context = entry.context ? `[${entry.context}]` : '';
    const message = `${timestamp} ${level} ${context} ${entry.message}`;
    return message;
  }

  private addLog(entry: LogEntry): void {
    this.logs.push(entry);
    
    // Keep array size manageable
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Always log to console in development
    if (this.isDevelopment) {
      const formatted = this.formatMessage(entry);
      const style = this.getConsoleStyle(entry.level);
      
      if (entry.data) {
        console.log(`%c${formatted}`, style, entry.data);
      } else {
        console.log(`%c${formatted}`, style);
      }

      if (entry.error) {
        console.log(`%cError Details: ${entry.error}`, 'color: #ff6b6b; font-weight: bold');
      }
    }

    // Log warnings and info to console in production too
    if (!this.isDevelopment && (entry.level === LogLevel.WARN || entry.level === LogLevel.INFO)) {
      const icon = entry.level === LogLevel.WARN ? '⚠️' : 'ℹ️';
      console.log(`${icon} ${entry.message} [${entry.context}]`, entry.data || '');
    }
  }

  private getConsoleStyle(level: LogLevel): string {
    const styles: Record<LogLevel, string> = {
      [LogLevel.DEBUG]: 'color: #7c3aed; font-weight: bold',
      [LogLevel.INFO]: 'color: #0ea5e9; font-weight: bold',
      [LogLevel.WARN]: 'color: #f59e0b; font-weight: bold',
      [LogLevel.ERROR]: 'color: #ef4444; font-weight: bold',
    };
    return styles[level];
  }

  debug(message: string, context?: string, data?: any): void {
    this.addLog({
      timestamp: new Date(),
      level: LogLevel.DEBUG,
      message,
      context,
      data,
    });
  }

  info(message: string, context?: string, data?: any): void {
    this.addLog({
      timestamp: new Date(),
      level: LogLevel.INFO,
      message,
      context,
      data,
    });
  }

  warn(message: string, context?: string, data?: any): void {
    this.addLog({
      timestamp: new Date(),
      level: LogLevel.WARN,
      message,
      context,
      data,
    });
  }

  error(message: string, context?: string, error?: Error | string, data?: any): void {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;

    this.addLog({
      timestamp: new Date(),
      level: LogLevel.ERROR,
      message,
      context,
      data,
      error: errorMessage,
    });

    // Always log errors to console, even in production
    console.error(`❌ ${message} [${context}]`, {
      error: errorMessage,
      stack: errorStack,
      data,
    });
  }

  getLogs(filter?: { level?: LogLevel; context?: string; limit?: number }): LogEntry[] {
    let filtered = [...this.logs];

    if (filter?.level) {
      filtered = filtered.filter((log) => log.level === filter.level);
    }

    if (filter?.context) {
      filtered = filtered.filter((log) => log.context === filter.context);
    }

    if (filter?.limit) {
      filtered = filtered.slice(-filter.limit);
    }

    return filtered;
  }

  getFormattedLogs(filter?: { level?: LogLevel; context?: string; limit?: number }): string {
    const logs = this.getLogs(filter);
    return logs.map((log) => this.formatMessage(log)).join('\n');
  }

  clearLogs(): void {
    this.logs = [];
  }

  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}

// Export singleton instance
export const logger = new Logger();

// Export for use in components and pages
export default logger;
