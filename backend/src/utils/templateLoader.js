import fs from 'fs/promises';
import path from 'path';
import { getDefaultTemplate } from '../templates/defaultReportTemplates.js';


// Load HTML template from external file with fallback
// @param {string} templateName - Name of the template file (without extension)
// @param {string} templateDir - Directory where templates are stored (default: 'templates')
// @returns {Promise<string>} - HTML template content
const loadHtmlTemplate = async (templateName = 'orders-report', templateDir = 'templates') => {
    try {
        const templatePath = path.join(process.cwd(), templateDir, `${templateName}.html`);
        const templateContent = await fs.readFile(templatePath, 'utf-8');
        
        console.log(`✅ Template loaded successfully: ${templateName}.html`);
        return templateContent;
        
    } catch (error) {
        console.warn(`⚠️ Template loading error for ${templateName}.html:`, error.message);
        
        // Try to get fallback template
        try {
            const fallbackTemplate = getDefaultTemplate(templateName);
            console.log(`✅ Using fallback template for: ${templateName}`);
            return fallbackTemplate;
        } catch (fallbackError) {
            console.error(`❌ Fallback template failed for ${templateName}:`, fallbackError.message);
            throw new Error(`Failed to load template: ${templateName}. No fallback available.`);
        }
    }
};


// Load multiple templates at once
// @param {string[]} templateNames - Array of template names
// @param {string} templateDir - Directory where templates are stored
// @returns {Promise<Object>} - Object with template names as keys and content as values
const loadMultipleTemplates = async (templateNames, templateDir = 'templates') => {
    const templates = {};
    
    for (const templateName of templateNames) {
        try {
            templates[templateName] = await loadHtmlTemplate(templateName, templateDir);
        } catch (error) {
            console.error(`Failed to load template: ${templateName}`, error.message);
            templates[templateName] = null;
        }
    }
    
    return templates;
};


// Check if template file exists
// @param {string} templateName - Name of the template file
// @param {string} templateDir - Directory where templates are stored
// @returns {Promise<boolean>} - True if template exists
const templateExists = async (templateName, templateDir = 'templates') => {
    try {
        const templatePath = path.join(process.cwd(), templateDir, `${templateName}.html`);
        await fs.access(templatePath);
        return true;
    } catch {
        return false;
    }
};


// List all available templates
// @param {string} templateDir - Directory where templates are stored
// @returns {Promise<string[]>} - Array of template names (without extension)
const listTemplates = async (templateDir = 'templates') => {
    try {
        const templatesPath = path.join(process.cwd(), templateDir);
        const files = await fs.readdir(templatesPath);
        
        return files
            .filter(file => file.endsWith('.html'))
            .map(file => path.basename(file, '.html'));
            
    } catch (error) {
        console.error('Error listing templates:', error.message);
        return [];
    }
};

export { 
    loadHtmlTemplate, 
    loadMultipleTemplates, 
    templateExists, 
    listTemplates 
};