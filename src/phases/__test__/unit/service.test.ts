import phaseService from "../../services/PhaseService";

describe('createNewPhase', () => {
  it('should create a new phase', () => {
    const phaseBodyField = {
      name: 'Test Phase',
      description: 'This is a test phase',
    };

    const newPhase = phaseService.createNewPhase(phaseBodyField);

    expect(newPhase).toEqual(expect.objectContaining({
      name: 'Test Phase',
      description: 'This is a test phase',
      tasks: [],
      done: false,
    }));
  });

  it('should throw an error if name and description are not provided', () => {
    const phaseBodyField = {
      name: '',
      description: '',
    };

    expect(() => {
      phaseService.createNewPhase(phaseBodyField);
    }).toThrow('name and description are required fields');
  });

  it('should throw an error if name already exists', () => {
    const phaseBodyField = {
      name: 'Test Phase',
      description: 'This is a test phase',
    };

    expect(() => {
      phaseService.createNewPhase(phaseBodyField);
    }).toThrow("Phase with name 'Test Phase' already exists");
  });
});