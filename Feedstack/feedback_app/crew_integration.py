import sys
import os
from pathlib import Path

#add the project root to path so we can import crew manager
sys.path.append('\Feedstack\crew_manager.py')
from Feedstack.crew_manager import process_design_with_crew, analyze_design, identify_design_theme, generate_theme_summary

class CrewIntegration:
    @staticmethod
    def process_design(image_path):
        """Process a design through the CrewAI workflow"""
        return process_design_with_crew(image_path)

    @staticmethod
    def analyze_design(image_path):
        """Just analyze a design without the full crew workflow"""
        return analyze_design(image_path)

    @staticmethod
    def indentify_theme(message):
        """Identify themes from a message"""
        return identify_design_theme(message)

    @staticmethod
    def generate_summary(theme, message):
        """Generate theme summary"""
        return generate_theme_summary(theme, message)
